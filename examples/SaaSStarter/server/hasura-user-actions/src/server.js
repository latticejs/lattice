require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const {
  registerAuth0User,
  addOrgMemberToHasura,
  addUserToHasura,
  cleanupOnFailure,
  checkIfUserIsMemberOfOtherOrgs,
  unlinkUserFromOrg,
  fetchUser,
  auth0LoginWithPassword,
  updateAuth0Info,
  updateHasuraUserEmail,
  checkIfAnotherUserExistsWithSameEmail,
  checkIfEmailAlreadyInUseForAuth0,
  updateHasuraUserName,
  updateHasuraUserProfilePicture,
} = require('./controller');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @method POST
 * @description API to register an auth0 user, add him to the hasura DB and finally
 * create a link for him with the organization in the organization_
 * member table by creating a new entry.
 * @param {String} name Name of the user.
 * @param {String} email Email of the user.
 * @param {String} orgId Organization Id, the user needs to be linked to.
 * @param {String} role Role of the user.
 * @returns {Object}
 */
app.post('/signup', async (req, res) => {
  // get request input
  const { name, email, orgId, role } = req.body.input;
  let auth0User;
  let authId;
  try {
    // Create a new user with the name and email, default password Cel@1234.
    const newAuth0UserResponse = await registerAuth0User(name, email);
    auth0User = newAuth0UserResponse.data;
    authId = auth0User.user_id;
  } catch (error) {
    return res.status(400).json({
      message: 'Unable to create auth0 account.',
    });
  }

  try {
    authId = auth0User.user_id;
    // Add the user to hasura.
    const newUserResponse = await addUserToHasura(name, email, authId);
    const { data, errors } = newUserResponse.data;
    if (errors) {
      // delete Auht0 user.
      await cleanupOnFailure({ authId });
      return res.status(400).json(errors[0]);
    }

    // Link the user and the organization.
    const newOrgMemberResponse = await addOrgMemberToHasura(orgId, role, data.insert_user_one.id);
    const { errors: orgMemberErrors } = newOrgMemberResponse.data;

    if (orgMemberErrors) {
      // delete Auth0 user and delete hasura user.
      await cleanupOnFailure({ authId, hasuraUser: data.insert_user_one.id });
      return res.status(400).json(orgMemberErrors[0]);
    }

    return res.json({ ...data.insert_user_one });
  } catch (error) {
    return res.status(400).json({
      message: error.message || 'Something went wrong!',
    });
  }
});

/**
 * @method POST
 * @description API to unlink a user from an organization.
 * If user is associated with multiple organizations unlink only the user.
 * Else delete the unlink and delete the user account and auth0 account.
 * @param {String} userId User ID.
 * @param {String} orgId Organization ID to unlink from.
 * @param {String} orgId Organization Id, the user needs to be linked to.
 * @returns {Object}
 */
app.post('/delete-user', async (req, res) => {
  const { userId, orgId } = req.body.input;
  try {
    // Check if the user is a member of other organizations.
    const response = await checkIfUserIsMemberOfOtherOrgs(userId, orgId);
    const { data, errors } = response.data;
    if (errors) {
      return res.status(400).json(errors[0]);
    }
    // Fetch the user's auth0_id from Hasura.
    const userResponse = await fetchUser(userId);
    const { data: userData, errors: fetchUserErrors } = userResponse.data;
    if (fetchUserErrors) return res.status(400).json(fetchUserErrors[0]);

    if (!Array.isArray(userData.user) || !userData.user.length) {
      return res.status(400).json({ message: 'User not found ' });
    }
    // If user is associated with multiple org's unlink only the specified one.
    if (Array.isArray(data.organization_member) && data.organization_member.length) {
      await unlinkUserFromOrg(userId, orgId);
    } else {
      // Unlink the user and delete user info from hasura and auth0
      await unlinkUserFromOrg(userId, orgId);
      if (userData.user[0].auth_id) {
        await cleanupOnFailure({
          authId: userData.user[0].auth_id,
          hasuraUser: userId,
        });
      }
    }
    return res.json({
      user_id: userId,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

/**
 * @method POST
 * @description API to change a user's password.
 * Only works if the existing password is provided.
 * @param {String} userId User ID.
 * @param {String} oldPassword Current user password.
 * @param {String} newPassword The password to be changed to.
 * @returns {Object}
 */
app.post('/change-password', async (req, res) => {
  try {
    const {
      userId,
      credentials: { newPassword, oldPassword },
    } = req.body.input;

    // Fetch the user's auth0_id  and email from Hasura.
    const userResponse = await fetchUser(userId);
    const { data: userData, errors: fetchUserErrors } = userResponse.data;
    if (fetchUserErrors) return res.status(400).json(fetchUserErrors[0]);

    if (!Array.isArray(userData.user) || !userData.user.length) {
      return res.status(400).json({ message: 'User not found ' });
    }
    const { auth_id: authId, email } = userData.user[0];
    if (!authId) return res.status(400).json({ message: 'Not an auth0 user' });

    try {
      /**
       * Auth0 doesn't have a way to check the current password.
       * After enabling the password grant the user should be able to retrieve
       * a token with this existing credentials. This can be used to verify the
       * existing password.
       */
      await auth0LoginWithPassword(email, oldPassword);
    } catch (error) {
      if (error.isAxiosError && (error.response.status === 403 || error.response.status === 401)) {
        return res.status(401).json({
          message: 'Incorrect password',
        });
      }
      return res.status(400).json({ message: 'Error authenticating user' });
    }

    try {
      // Change the password for the specified user
      await updateAuth0Info(authId, { password: newPassword });
    } catch (error) {
      if (error.isAxiosError && error.response.status === 400) {
        return res.status(400).json({
          message: error.response.data.message,
        });
      }
      return res.status(400).json({
        message: 'Unable to change password',
      });
    }

    // Return the user_id if the password was changed.
    return res.status(200).json({
      user_id: userId,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong',
    });
  }
});

/**
 * @method POST
 * @description API to change a user's email id, name and profile picture.
 * @param {String} userId User ID.
 * @param {String} newEmail The email id to be updated to.
 * @param {String} name The name to be updated to.
 * @param {String} profilePictureUrl The url of the profile picture be updated to.
 * @returns {Object}
 */
app.post('/change-email', async (req, res) => {
  try {
    const { userId, newEmail, name, profilePictureUrl } = req.body.input;
    // Fetch the user's auth0_id  and email from Hasura.
    const userResponse = await fetchUser(userId);
    const { data: userData, errors: fetchUserErrors } = userResponse.data;
    if (fetchUserErrors) return res.status(400).json(fetchUserErrors[0]);
    if (!Array.isArray(userData.user) || !userData.user.length) {
      return res.status(400).json({ message: 'User not found ' });
    }

    if (name) {
      try {
        // Update the user's name in Hasura
        await updateHasuraUserName(userId, name);
      } catch (error) {
        if (error.isAxiosError && error.response.status === 400) {
          return res.status(400).json({
            message: error.response.data.message,
          });
        }
        return res.status(400).json({
          message: 'Unable to change name',
        });
      }
    }

    if (profilePictureUrl) {
      try {
        // Update the url of the users profile picture
        await updateHasuraUserProfilePicture(userId, profilePictureUrl);
      } catch (error) {
        if (error.isAxiosError && error.response.status === 400) {
          return res.status(400).json({
            message: error.response.data.message,
          });
        }
        return res.status(400).json({
          message: 'Unable to change profile picture',
        });
      }
    }

    if (newEmail) {
      const { auth_id: authId } = userData.user[0];
      if (!authId) return res.status(400).json({ message: 'Not an auth0 user' });

      const checkResponse = await checkIfAnotherUserExistsWithSameEmail(userId, newEmail);
      const { data: duplicateHasuraUser, errors: checkErrors } = checkResponse;
      if (checkErrors) return res.status(400).json(checkErrors[0]);

      const { data: duplicateAuth0User } = await checkIfEmailAlreadyInUseForAuth0(newEmail);

      if (duplicateHasuraUser.data.user.length || duplicateAuth0User.length) {
        return res.status(400).json({
          message: 'Email already in use',
        });
      }
      try {
        // Change the email for the specified user's auth0 account
        await updateAuth0Info(authId, { email: newEmail });
        // Change the email Id in the Hasura DB.
        await updateHasuraUserEmail(userId, newEmail);
      } catch (error) {
        if (error.isAxiosError && error.response.status === 400) {
          return res.status(400).json({
            message: error.response.data.message,
          });
        }
        return res.status(400).json({
          message: 'Unable to change email',
        });
      }
    }
    // Return the user_id if the email was changed.
    return res.status(200).json({
      user_id: userId,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong',
    });
  }
});

app.listen(PORT, () => console.log(PORT));

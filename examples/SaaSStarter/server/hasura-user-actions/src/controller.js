const axios = require('axios');
const jwt = require('jsonwebtoken');
const qs = require('qs');

let token;
const {
  HASURA_OPS: {
    HASURA_OPERATION_ADD_ORG_MEMBER,
    HASURA_OPERATION_ADD_USER,
    HASURA_OPERATION_DEL_USER,
    HASURA_OPERATION_UNLINK_USER_FROM_ORG,
    HASURA_OPERATION_FETCH_USER_ORGS,
    HASURA_OPERTION_FETCH_USER,
    HASURA_OPERATION_UPDATE_USER_EMAIL,
    HASURA_CHECK_EMAIL_DUPLICATE_EXISTS,
    HASURA_OPERATION_UPDATE_USER_NAME,
    HASURA_OPERATION_UPDATE_USER_PROFILE_PICTURE,
  },
  HASURA_HEADERS,
  HASURA_URL,
  AUTH0: { DOMAIN, CLIENT_ID, CLIENT_SECRET, TOKEN_AUDIENCE, TOKEN_GRANT_TYPE, PASSWORD_GRANT_TYPE },
  DEFAULT_USER_PASSWORD,
} = require('./constants');

/**
 * @async
 * @description Adds a new user to hasura db.
 * @param {String} name username.
 * @param {String} email user's email.
 * @param {String} authId user's auth0 id.
 * @returns {Object}
 */
const addUserToHasura = async (name, email, authId) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_OPERATION_ADD_USER,
      variables: {
        name,
        email,
        authId,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );

/**
 * @async
 * @description Link user to organization.
 * @param {String} orgId organization id.
 * @param {String} role role.
 * @param {String} userId user id.
 * @returns {Object}
 */
const addOrgMemberToHasura = async (orgId, role, userId) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_OPERATION_ADD_ORG_MEMBER,
      variables: {
        orgId,
        role,
        userId,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );

/**
 * @async
 * @description Generate an auth token for auth0 operations.
 * @returns {String} token
 */
const getAuthToken = async () => {
  // Check if the token has expired.
  const expiry = token ? jwt.decode(token).exp < new Date().getTime() / 1000 : true;

  if (!token || expiry) {
    // Generate a new token if the old one is invalid or has expired.
    const response = await axios.post(
      `${DOMAIN}/oauth/token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        audience: TOKEN_AUDIENCE,
        grant_type: TOKEN_GRANT_TYPE,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const { data } = response;
    token = data.access_token;
    return token;
  }
  // Reuse the old token.
  return token;
};

/**
 * @async
 * @description Creates an auth0 account with the provided credentials.
 * @param {String} name
 * @param {String} email
 * @param {String} password
 * @returns {Object}
 */
const registerAuth0User = async (name, email, password = DEFAULT_USER_PASSWORD) => {
  const accessToken = await getAuthToken();
  return axios.post(
    `${DOMAIN}/api/v2/users`,
    {
      name,
      email,
      password,
      connection: 'Username-Password-Authentication',
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * @async
 * @description Delete auth0 user with the specified auth0 id.
 * @param {String} auth0Id
 * @returns {Object}
 */
const deleteAuth0User = async (auth0Id) => {
  const accessToken = await getAuthToken();
  return axios.delete(`${DOMAIN}/api/v2/users/${auth0Id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * @async
 * @description Check if the user is a member of other organizations.
 * @param {String} userId
 * @param {String} orgId
 * @returns {Object}
 */
const checkIfUserIsMemberOfOtherOrgs = async (userId, orgId) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_OPERATION_FETCH_USER_ORGS,
      variables: {
        userId,
        orgId,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );
/**
 * @async
 * @description Unlinks a user from organization by removing the entry
 * from organization_members table.
 * @param {String} userId
 * @param {String} orgId
 */
const unlinkUserFromOrg = async (userId, orgId) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_OPERATION_UNLINK_USER_FROM_ORG,
      variables: {
        userId,
        orgId,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );

/**
 * @async
 * @description Deletes user data from the db.
 * @param {String} userId
 * @returns {Object}
 */
const deleteHasuraUser = async (userId) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_OPERATION_DEL_USER,
      variables: {
        userId,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );

/**
 * @async
 * @description Cleanup operations in case one of the insertions fail.
 * @param {String} authId auth0 user id.
 * @param {String} hasuraUser user id from db.
 */
const cleanupOnFailure = async ({ authId, hasuraUser }) => {
  if (authId) {
    await deleteAuth0User(authId).catch((err) => console.log(`Unable to auth0 user ${authId}`, err));
  }

  if (hasuraUser) {
    await deleteHasuraUser(hasuraUser).catch((err) => console.log(`Unable to delete user: ${hasuraUser}`, err));
  }
};

/**
 * @async
 * @description Fetch user details from db.
 * @param {String} userId user id.
 * @returns {Object}
 */
const fetchUser = async (userId) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_OPERTION_FETCH_USER,
      variables: {
        userId,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );

/**
 * @async
 * @description Uses the email id and the password to retrieve an
 * access token from auth0.
 * NOTE: This can be used only after enabling
 * password grant in auth0 application and setting the tenants default connection
 * or default_directory for authentication from one of the available defaults.
 * @param {String} username Username or email id used to create the auth0 account.
 * @param {String} password User password.
 * @returns {Object}
 */
const auth0LoginWithPassword = async (username, password) =>
  axios.post(
    `${DOMAIN}/oauth/token`,
    qs.stringify({
      grant_type: PASSWORD_GRANT_TYPE,
      username,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      password,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

/**
 * @async
 * @description Changes the password for the user specified by
 * the userId.
 * @param {String} userId users auth0 id.
 * @param {Object} data Update information.
 * @returns {Object}
 */
const updateAuth0Info = async (userId, data) => {
  const accessToken = await getAuthToken();
  return axios.patch(`${DOMAIN}/api/v2/users/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * @async
 * @description Changes the email for the user specified by
 * the userId in Hasura connected DB.
 * @param {String} userId users auth0 id.
 * @param {Object} email email id.
 * @returns {Object}
 */
const updateHasuraUserEmail = async (userId, email) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_OPERATION_UPDATE_USER_EMAIL,
      variables: {
        userId,
        email,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );

/**
 * @async
 * @description Checks the Hasura db for another user with the same email id.
 * @param {String} userId users hasura db id.
 * @param {Object} email email id.
 * @returns {Object}
 */
const checkIfAnotherUserExistsWithSameEmail = async (userId, email) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_CHECK_EMAIL_DUPLICATE_EXISTS,
      variables: {
        userId,
        email,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );

/**
 * @async
 * @description Searches Auth0 for users having the same email id.
 * @param {Object} email email id to search for.
 * @returns {Object}
 */
const checkIfEmailAlreadyInUseForAuth0 = async (email) => {
  const accessToken = await getAuthToken();
  return axios.get(`${DOMAIN}/api/v2/users-by-email?email=${email}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * @async
 * @description Changes the name for the user specified by
 * the userId in Hasura connected DB.
 * @param {String} userId users  id.
 * @param {Object} name name.
 * @returns {Object}
 */
const updateHasuraUserName = async (userId, name) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_OPERATION_UPDATE_USER_NAME,
      variables: {
        userId,
        name,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );

/**
 * @async
 * @description Changes the photo_url for the user specified by
 * the userId in Hasura connected DB.
 * @param {String} userId users id.
 * @param {String} profilePictureUrl url of the profile picture.
 * @returns {Object}
 */
const updateHasuraUserProfilePicture = async (userId, profilePictureUrl) =>
  axios.post(
    HASURA_URL,
    {
      query: HASURA_OPERATION_UPDATE_USER_PROFILE_PICTURE,
      variables: {
        userId,
        profilePictureUrl,
      },
    },
    {
      headers: HASURA_HEADERS,
    }
  );

module.exports = {
  registerAuth0User,
  addUserToHasura,
  cleanupOnFailure,
  addOrgMemberToHasura,
  checkIfUserIsMemberOfOtherOrgs,
  unlinkUserFromOrg,
  fetchUser,
  deleteAuth0User,
  deleteHasuraUser,
  auth0LoginWithPassword,
  updateAuth0Info,
  updateHasuraUserEmail,
  checkIfAnotherUserExistsWithSameEmail,
  checkIfEmailAlreadyInUseForAuth0,
  updateHasuraUserName,
  updateHasuraUserProfilePicture,
};

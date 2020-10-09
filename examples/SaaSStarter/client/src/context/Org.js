import { toast } from 'react-toastify';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { createContext, useEffect, useState } from 'react';
import gql from 'graphql-tag';

const MY_ORGS = gql`
  query MyOrgs {
    logged_in_user {
      id
      auth_id
      name
      profile_photo
      email
      organization_member {
        role
        organization {
          id
          name
          orgCode
          skin_color
          logo_url
        }
      }
    }
  }
`;

/**
 * query to get user role
 */
const USER_ROLE = gql`
  query getUserRoleByAuthId($auth_id: String) {
    user_role(where: { user_auth_id: { _eq: $auth_id } }) {
      is_super_admin
    }
  }
`;

/**
 * query to update user
 */
const UPDATE_USER = gql`
  mutation updateUserDetail(
    $id: uuid
    $name: String
    $profile_photo: String
    $email: String
  ) {
    changeEmail(
      userId: $id
      name: $name
      profilePictureUrl: $profile_photo
      newEmail: $email
    ) {
      user_id
    }
  }
`;

/**
 * query to update the user password
 */
const UPDATE_USER_PASSWORD = gql`
  mutation changePassword(
    $oldPass: String!
    $newPass: String!
    $userId: uuid!
  ) {
    changePassword(
      credentials: { newPassword: $newPass, oldPassword: $oldPass }
      userId: $userId
    ) {
      user_id
    }
  }
`;

/**
 * query to Update Org
 */
const UPDATE_ORG = gql`
  mutation updateOrg(
    $id: uuid
    $name: String
    $orgCode: String
    $skin_color: String
    $logo_url: String
  ) {
    update_organization(
      where: { id: { _eq: $id } }
      _set: {
        name: $name
        orgCode: $orgCode
        skin_color: $skin_color
        logo_url: $logo_url
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

/**
 * query to insert new Org
 */
const INSERT_ORG = gql`
  mutation insertOrg(
    $name: String
    $orgCode: String
    $skin_color: String
    $logo_url: String
  ) {
    insert_organization(
      objects: {
        name: $name
        orgCode: $orgCode
        skin_color: $skin_color
        logo_url: $logo_url
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

/**
 * query to insert new member
 */
const INSERT_MEMBER = gql`
  mutation insertOrgMemeber($userId: uuid, $orgId: uuid, $role: String) {
    insert_organization_member(
      objects: { user_id: $userId, organization_id: $orgId, role: $role }
    ) {
      affected_rows
    }
  }
`;

/**
 * query to Delete memeber
 */
const DELETE_MEMBER = gql`
  mutation deleteOrgMember($id: uuid, $organization_id: uuid) {
    delete_organization_member(
      where: {
        _and: { user_id: { _eq: $id } }
        organization_id: { _eq: $organization_id }
      }
    ) {
      affected_rows
    }
  }
`;

/**
 * query to Delete Org
 */
const DELETE_ORG = gql`
  mutation deleteOrg($id: uuid) {
    delete_organization(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export const Context = createContext({});
export const Provider = ({ children, idToken }) => {
  const [selectedOrg, setSelectedOrg] = useState(null);
  const orgResponse = useQuery(MY_ORGS);
  const orgsLoading = orgResponse.loading;
  const orgsError = orgResponse.err;
  const myorgs = orgResponse.data;
  const [updateUserDetail] = useMutation(UPDATE_USER);
  const { data: role } = useQuery(USER_ROLE, {
    variables: { auth_id: myorgs ? myorgs.logged_in_user[0].auth_id : '' },
  });
  const [updateOrg] = useMutation(UPDATE_ORG);
  const [insertOrg] = useMutation(INSERT_ORG);
  const [deleteOrg] = useMutation(DELETE_ORG);
  const [insertOrgMemeber] = useMutation(INSERT_MEMBER);
  const [deleteOrgMember] = useMutation(DELETE_MEMBER);
  let isSuperAdmin = false;

  if (role && role.user_role.length > 0) {
    isSuperAdmin = role.user_role[0].is_super_admin;
  }

  let userOrgs;
  let loggedInUserID;
  let loggedInUserDetails;

  if (!orgsLoading && myorgs && myorgs.logged_in_user) {
    userOrgs = [];
    myorgs.logged_in_user[0].organization_member.forEach((org) => {
      userOrgs.push(org.organization);
    });
    loggedInUserID = myorgs.logged_in_user[0].id;
    loggedInUserDetails = myorgs.logged_in_user[0];
  }

  let userOrgRoles;

  /**
   * @function updateMediaName
   * @param {string} id [primary key]
   * @param {string} fileName [updated file name]
   * @returns get updated response
   */
  const insertOrgMemeberDetail = (orgId) => {
    const userId = myorgs.logged_in_user[0].id;
    const result = insertOrgMemeber({
      variables: {
        userId: userId,
        orgId: orgId,
        role: 'Admin',
      },
    });
    return result.then(() => {
      refetchOrg();
    });
  };

  if (!orgsLoading && myorgs && myorgs.logged_in_user) {
    userOrgRoles = [];
    myorgs.logged_in_user[0].organization_member.forEach((org) => {
      userOrgRoles.push({ role: org.role, orgId: org.organization.id });
    });
  }

  const [changePassword] = useMutation(UPDATE_USER_PASSWORD);

  /**
   * @function changeUserPassword
   * @param {Object} userdetails
   * @returns updated row
   */
  const changeUserPassword = (userdetails) => {
    const userPass = changePassword({
      variables: {
        oldPass: userdetails.currentPassword,
        newPass: userdetails.newPassword,
        userId: userdetails.userId,
      },
    });

    return userPass;
  };

  const history = useHistory();
  const orgMatch = useRouteMatch('/:orgCode');
  const changeOrg = ({ org, ladningPath = '/', redirect = true }) => {
    // Full page reload for for now.
    const goTo = `/ ${org.orgCode}`;
    if (redirect) {
      window.location.assign(goTo);
    } else {
      history.push(goTo);
    }
  };

  /**
   * @function refetchOrg
   * @returns get updated response
   */
  const refetchOrg = () => {
    const orgPath = orgMatch ? orgMatch.params.orgCode : undefined;
    const result = orgResponse.refetch();
    return result.then((response) => {
      response.data.logged_in_user[0].organization_member.forEach((org) => {
        if (org.organization.orgCode === orgPath) {
          setSelectedOrg(org.organization);
        }
      });
    });
  };

  /**
   * @function updateUser
   * @param {object} userObj [user object]
   * @param {boolean} emailChangeFlag [flag]
   * @returns get updated response
   */
  const updateUser = (userObj, emailChangeFlag) => {
    const obj = {
      variables: {
        id: userObj.id,
        name: userObj.name,
        profile_photo: userObj.profile_photo,
      },
    };
    if (emailChangeFlag) {
      obj.variables.email = userObj.email;
    }

    const result = updateUserDetail(obj);
    return result.then(() => {});
  };

  /**
   * @function updateOrgDetail
   * @param {object} orgObj
   * @returns get refetch org
   */
  const updateOrgDetail = (orgObj) => {
    const result = updateOrg({
      variables: {
        id: orgObj.id,
        name: orgObj.name,
        orgCode: orgObj.orgCode,
        skin_color: orgObj.skin_color,
        logo_url: orgObj.logo_url,
      },
    });
    return result.then(() => {
      refetchOrg();
    });
  };

  /**
   * @function insertOrgDetail
   * @param {object} orgObj
   * @returns insert org member deatil
   */
  const insertOrgDetail = (orgObj) => {
    const result = insertOrg({
      variables: {
        name: orgObj.name,
        orgCode: orgObj.orgCode,
        skin_color: orgObj.skin_color,
        logo_url: orgObj.logo_url,
      },
    });
    return result.then((response) => {
      insertOrgMemeberDetail(response.data.insert_organization.returning[0].id);
    });
  };

  /**
   * @function deleteOrgDetail
   * @param {orgId} uuid
   * @returns get updated response
   */
  const deleteOrgDetail = (orgId) => {
    const result = deleteOrg({
      variables: {
        id: orgId,
      },
    });
    return result.then(() => {
      toast.success('Org deleted successfully');
      refetchOrg();
    });
  };

  /**
   * @function deleteOrgMemberDetail
   * @param {object} orgData
   * @description delete  org after delete org
   */
  const deleteOrgMemberDetail = (orgData) => {
    const userId = myorgs.logged_in_user[0].id;
    const result = deleteOrgMember({
      variables: {
        id: userId,
        organization_id: orgData.id,
      },
    });
    return result.then(() => {
      deleteOrgDetail(orgData.id);
    });
  };

  // Org selection logic
  // inputs:
  //   orgPath = org code from path
  //   selectedOrg = we have a selected org object
  //   userOrgs = orgs user has access to

  // if no orgPath
  //    if userOrgs.lengh == 1
  //        changeOrg(userOrgs[0])
  //    if userOrgs.length > 1
  //        // org route will display list of member orgs to choose from
  //               selectedOrg is null
  // else if orgPath
  //    if no selectedOrg
  //      if userOrgs == 1
  //        setSelectedOrg(userOrgs[0])
  //      else if userOrgs.lengh > 1
  //        loop userOrgs
  //            if(org.orgCode == orgPath)
  //              setSelectedOrg(org)
  //     if selectedOrg.orgCode != orgPath
  //        if(selectedOrg) changeOrg(userOrgs[0])
  //        else redirect("/");

  useEffect(() => {
    const orgPath = orgMatch ? orgMatch.params.orgCode : undefined;
    if (!orgPath) {
      if (userOrgs && userOrgs.length === 1) {
        setSelectedOrg(userOrgs[0]);
        changeOrg({ org: userOrgs[0], redirect: false });
      }
    } else if (!selectedOrg && userOrgs) {
      let tempOrg;
      userOrgs.forEach((org) => {
        if (org.orgCode === orgPath) {
          setSelectedOrg(org);
          tempOrg = org;
        }
      });
      if (!tempOrg && orgPath !== 'profile') {
        // user is not a memeber of current orgPath
        // bounce back to root, however it maybe be better
        // to have an error view condition to let them know they don't have permissions to access the org they are requesting.
        history.push('/');
      }
    } else if (selectedOrg && selectedOrg.orgCode !== orgPath) {
      // eslint-disable-next-line no-console
      userOrgs.forEach((org) => {
        if (org.orgCode === orgPath) {
          setSelectedOrg(org);
        }
      });
    }
  }, [orgMatch, userOrgs]);

  const orgContext = {
    orgsLoading,
    orgsError,
    userOrgs,
    userOrgRoles,
    loggedInUserID,
    selectedOrg,
    changeOrg,
    idToken,
    loggedInUserDetails,
    updateUser,
    changeUserPassword,
    insertOrgDetail,
    updateOrgDetail,
    isSuperAdmin,
    insertOrgMemeberDetail,
    deleteOrgMemberDetail,
    deleteOrgDetail,
    orgMatch,
  };

  // pass the value in provider and return
  return <Context.Provider value={orgContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

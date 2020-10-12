/* eslint-disable no-case-declarations */
import { getSelectOptions } from '../helper/commonHelper';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import React, { createContext, useEffect, useState } from 'react';
import gql from 'graphql-tag';

const GET_USERS = gql`
  query user(
    $orgID: uuid
    $offset: Int
    $limit: Int
    $order_by: [user_order_by!]
    $nameFilter: String
    $emailFilter: String
    $roleFilter: String
  ) {
    user(
      order_by: $order_by
      offset: $offset
      limit: $limit
      where: {
        _and: {
          organization_members: { organization_id: { _eq: $orgID } }
          _and: {
            name: { _like: $nameFilter }
            email: { _like: $emailFilter }
            organization_members: { role: { _like: $roleFilter } }
          }
        }
      }
    ) {
      id
      name
      email
      created_at
      organization_members(where: { organization_id: { _eq: $orgID } }) {
        role
      }
    }
    user_aggregate(
      where: {
        _and: {
          organization_members: { organization_id: { _eq: $orgID } }
          _and: {
            name: { _like: $nameFilter }
            email: { _like: $emailFilter }
            organization_members: { role: { _like: $roleFilter } }
          }
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

/**
 * query to Delete user
 */
const DELETE_USER = gql`
  mutation unlinkUserFromOrg($userId: String!, $orgId: String!) {
    unlinkUserFromOrgAndDeleteUserAccount(orgId: $orgId, userId: $userId) {
      user_id
    }
  }
`;

/**
 * query to validate the user
 */
const VALIDATE_USER_EMAIL = gql`
  query user($emailID: String) {
    user(where: { email: { _eq: $emailID } }) {
      id
      name
      email
      created_at
      organization_members {
        organization_id
        role
      }
    }
  }
`;

/**
 * query to Add reference of user to organiozation member
 */
const ADD_TO_ORGANIZATION_MEMBER = gql`
  mutation insertOrganizationMember($userID: uuid, $orgID: uuid, $userRole: String) {
    insert_organization_member(objects: { user_id: $userID, organization_id: $orgID, role: $userRole }) {
      affected_rows
      returning {
        user_id
      }
    }
  }
`;

/**
 * query to update the organiozation member
 */
const UPDATE_TO_ORGANIZATION_MEMBER = gql`
  mutation updateOrganizationMember($userID: uuid, $orgID: uuid, $userRole: String) {
    update_organization_member(
      where: { user_id: { _eq: $userID }, organization_id: { _eq: $orgID } }
      _set: { role: $userRole }
    ) {
      affected_rows
      returning {
        user_id
      }
    }
  }
`;

/**
 * query to update the user name
 */
const UPDATE_USER = gql`
  mutation updateUser($userID: uuid, $userName: String) {
    update_user(where: { id: { _eq: $userID } }, _set: { name: $userName }) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

/**
 * query to add new user
 */
const ADD_NEW_USER = gql`
  mutation createUser($email: String, $name: String, $orgId: uuid, $role: String) {
    signup(email: $email, name: $name, orgId: $orgId, role: $role) {
      id
    }
  }
`;

export const Context = createContext({});

export const Provider = ({ children, currentOrg }) => {
  const orgId = currentOrg.id;
  const [userDetailsContext, setUserDetailsContext] = useState(null);
  const usersResponse = useQuery(GET_USERS, {
    variables: {
      orgID: orgId,
      limit: 20,
      offset: 0,
      order_by: { updated_at: 'asc' },
      nameFilter: '%%',
      emailFilter: '%%',
      roleFilter: '%%',
    },
  });
  const usersLoading = usersResponse.loading;
  const userError = usersResponse.error;
  const users = !usersResponse.loading ? usersResponse.data.user : undefined;
  const totalUser = !usersResponse.loading ? usersResponse.data.user_aggregate.aggregate.count : 0;
  let userOptions = [];
  if (users) {
    userOptions = getSelectOptions(users, 'name', 'id');
  }
  /**
   * Execute the query to validate the user email
   */
  const [getUser, { data }] = useLazyQuery(VALIDATE_USER_EMAIL, {
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    setUserDetailsContext(data);
  }, [data]);

  const [deleteUser] = useMutation(DELETE_USER);
  const [insertOrganizationMember] = useMutation(ADD_TO_ORGANIZATION_MEMBER);
  const [updateOrganizationMember] = useMutation(UPDATE_TO_ORGANIZATION_MEMBER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [createUser] = useMutation(ADD_NEW_USER);

  /**
   * @function refetchUserDetails
   * @returns get updated response
   */
  const refetchUserDetails = (emailQuery = '') => usersResponse.refetch(emailQuery);

  /**
   * @function validateUserEmail
   * @param {value} userEmail
   * @returns get user details
   */
  const validateUserEmail = (userEmail) => {
    getUser({ variables: { emailID: userEmail } });
  };

  /**
   * @function addNewUser
   * @param {Object} userdetails
   * @returns updated row
   */
  const addNewUser = (userdetails) => {
    const orgResult = createUser({
      variables: {
        email: userdetails.userEmail,
        name: userdetails.userName,
        orgId: userdetails.orgID,
        role: userdetails.userRole,
      },
    });

    return orgResult.then(() => {
      refetchUserDetails();
    });
  };

  /**
   * @function updateUserOrganizationContext
   * @param {Object} userdetails
   * @returns updated row
   */
  const updateUserOrganizationContext = (userdetails) => {
    let orgResult;
    const queryObj = {
      variables: {
        userID: userdetails.userID,
        orgID: userdetails.orgID,
        userRole: userdetails.userRole,
      },
    };

    if (userdetails.isUserFromSameOrg) {
      orgResult = updateOrganizationMember(queryObj);
      orgResult = updateUser({
        variables: {
          userID: userdetails.userID,
          userName: userdetails.userName,
        },
      });
    } else {
      orgResult = insertOrganizationMember(queryObj);
    }

    return orgResult.then(() => {
      refetchUserDetails();
    });
  };

  /**
   * @function deleteUserById
   * @param {string} id [primary key]
   * @returns get updated response
   */
  const deleteUserCotext = (userdetails) => {
    const result = deleteUser({
      variables: {
        userId: userdetails.userId,
        orgId: userdetails.orgId,
      },
    });

    return result.then(() => {
      refetchUserDetails();
    });
  };

  /**
   * Implement pagination
   * @param {object} pagingObj
   */
  const fetchUsers = (pagingObj) => {
    let sortObj = {};
    if (pagingObj.clearData) {
      usersResponse.data.user = [];
    }
    if (pagingObj.orderBy) {
      sortObj = { [pagingObj.orderBy.name]: pagingObj.orderBy.type };
    }

    if (pagingObj.filteringObj) {
      pagingObj.filteringObj.name = `%${pagingObj.filteringObj.name}%`;
      pagingObj.filteringObj.email = `%${pagingObj.filteringObj.email}%`;
      pagingObj.filteringObj.role = `%${pagingObj.filteringObj.role}%`;
    }

    usersResponse.fetchMore({
      variables: {
        orgID: currentOrg.id,
        offset: pagingObj.offset,
        limit: pagingObj.limit,
        order_by: sortObj,
        nameFilter: pagingObj.filteringObj.name,
        emailFilter: pagingObj.filteringObj.email,
        roleFilter: pagingObj.filteringObj.role,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          user: [...prev.user, ...fetchMoreResult.user],
          user_aggregate: fetchMoreResult.user_aggregate,
        };
      },
    });
  };

  const userContext = {
    usersLoading,
    userError,
    users,
    deleteUserCotext,
    validateUserEmail,
    userDetailsContext,
    updateUserOrganizationContext,
    addNewUser,
    totalUser,
    fetchUsers,
    userOptions,
  };

  // pass the value in provider and return
  return <Context.Provider value={userContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

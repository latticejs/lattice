/* eslint-disable no-case-declarations */
import { getSelectOptions } from '../helper/commonHelper';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/react-hooks';
import React, { createContext } from 'react';
import gql from 'graphql-tag';

const GET_USERGROUP = gql`
  query user_group($offset: Int, $limit: Int, $orgId: uuid) {
    user_group(where: { org_id: { _eq: $orgId } }, offset: $offset, limit: $limit) {
      id
      group_details {
        id
        name
      }
      users
    }
  }
`;

/**
 * query to Update File Name
 */
const INSERT_GROUP = gql`
  mutation insertGroup($name: String) {
    insert_group(objects: { name: $name }) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

/**
 * query to Update File Name
 */
const UPDATE_GROUP = gql`
  mutation updateGroup($id: uuid, $name: String) {
    update_group(where: { id: { _eq: $id } }, _set: { name: $name }) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

/**
 * query to Update File Name // optional orgid, groupid
 */
const UPDATE_USERGROUP = gql`
  mutation insertUserGroup($id: uuid, $users: jsonb) {
    update_user_group(where: { id: { _eq: $id } }, _set: { users: $users }) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

/**
 * query to Update File Name
 */
const INSERT_USERGROUP = gql`
  mutation insertUserGroup($users: jsonb, $orgId: uuid, $groupId: uuid) {
    insert_user_group(objects: { users: $users, org_id: $orgId, group_id: $groupId }) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

const GET_USERS = gql`
  query user($orgID: uuid) {
    user(where: { _and: { organization_members: { organization_id: { _eq: $orgID } } } }) {
      id
      name
      organization_members(where: { organization_id: { _eq: $orgID } }) {
        role
      }
    }
  }
`;

/**
 * query to Delete user
 */
const DELETE_GROUP = gql`
  mutation deleteGroup($id: uuid) {
    delete_group(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

/**
 * query to Delete user
 */
const DELETE_USERGROUP = gql`
  mutation deleteUserGroup($id: uuid) {
    delete_user_group(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export const Context = createContext({});

export const Provider = ({ children, currentOrg }) => {
  const orgId = currentOrg.id;

  const userGoupsResponse = useQuery(GET_USERGROUP, {
    variables: { limit: 50, offset: 0, orgId },
  });
  const userGroupsLoading = userGoupsResponse.loading;
  const userGroupsError = userGoupsResponse.error;
  const userGroupsData = !userGoupsResponse.loading ? userGoupsResponse.data.user_group : undefined;
  const usersResponse = useQuery(GET_USERS, { variables: { orgID: orgId } });
  const [insertGroup] = useMutation(INSERT_GROUP);
  const [insertUserGroup] = useMutation(INSERT_USERGROUP);
  const [updateGroup] = useMutation(UPDATE_GROUP);
  const [updateUserGroup] = useMutation(UPDATE_USERGROUP);
  const [deleteGroup] = useMutation(DELETE_GROUP);
  const [deleteUserGroup] = useMutation(DELETE_USERGROUP);

  const users = !usersResponse.loading ? usersResponse.data.user : undefined;
  // const totalUser = !usersResponse.loading ? usersResponse.data.user_aggregate.aggregate.count : 0;
  const totalUser = 5;
  let userOptions = [];
  if (users) {
    userOptions = getSelectOptions(users, 'name', 'id');
  }

  /**
   * @function refetchPatients
   * @returns get updated response
   */
  const refetchUserGroups = () => userGoupsResponse.refetch();

  /**
   * @function updateMediaName
   * @param {string} id [primary key]
   * @param {string} fileName [updated file name]
   * @returns get updated response
   */
  const insertGroupDetail = (userGroupObj) => {
    const result = insertGroup({
      variables: {
        name: userGroupObj.group_details.name,
      },
    });
    return result.then((response) => {
      userGroupObj.group_details.id = response.data.insert_group.returning[0].id;
      insertUserGroupDetail(userGroupObj);
    });
  };

  /**
   * @function updateMediaName
   * @param {string} id [primary key]
   * @param {string} fileName [updated file name]
   * @returns get updated response
   */
  const insertUserGroupDetail = (userGroupObj) => {
    const result = insertUserGroup({
      variables: {
        users: userGroupObj.users,
        groupId: userGroupObj.group_details.id,
        orgId: currentOrg.id,
      },
    });
    return result.then(() => {
      toast.success('Group added successfully');
      refetchUserGroups();
    });
  };

  /**
   * @function updateMediaName
   * @param {string} id [primary key]
   * @param {string} fileName [updated file name]
   * @returns get updated response
   */
  const updateGroupDetail = (userGroupObj) => {
    const result = updateGroup({
      variables: {
        id: userGroupObj.group_details.id,
        name: userGroupObj.group_details.name,
      },
    });
    return result.then((response) => {
      updateUserGroupDetail(userGroupObj);
    });
  };

  /**
   * @function updateMediaName
   * @param {string} id [primary key]
   * @param {string} fileName [updated file name]
   * @returns get updated response
   */
  const updateUserGroupDetail = (userGroupObj) => {
    const result = updateUserGroup({
      variables: {
        id: userGroupObj.id,
        users: userGroupObj.users,
        // groupId: userGroupObj.group_details.id,
        // orgId: currentOrg.id,
      },
    });
    return result.then(() => {
      toast.success('Group updated successfully');
      refetchUserGroups();
    });
  };

  /**
   * @function deleteUserById
   * @param {string} id [primary key]
   * @returns get updated response
   */
  const deleteUserGroupCotext = (userGroup) => {
    const result = deleteUserGroup({
      variables: {
        id: userGroup.id,
      },
    });
    return result.then(() => {
      toast.success('Group deleted successfully');
      refetchUserGroups();
    });
  };

  /**
   * @function deleteUserById
   * @param {string} id [primary key]
   * @returns get updated response
   */
  const deleteGroupCotext = (userGroup) => {
    const result = deleteGroup({
      variables: {
        id: userGroup.group_details.id,
      },
    });
    return result.then(() => {
      deleteUserGroupCotext(userGroup);
    });
  };

  const userContext = {
    userGroupsLoading,
    userGroupsError,
    userGroupsData,
    totalUser,
    users,
    userOptions,
    insertGroupDetail,
    insertUserGroupDetail,
    updateGroupDetail,
    updateUserGroupDetail,
    deleteGroupCotext,
  };

  // pass the value in provider and return
  return <Context.Provider value={userContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

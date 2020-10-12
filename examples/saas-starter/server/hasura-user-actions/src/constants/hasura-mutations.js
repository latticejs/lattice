const HASURA_OPERATION_UNLINK_USER_FROM_ORG = `mutation unlinkUserFromOrg($userId: uuid, $orgId: uuid) {
  delete_organization_member(where: {
    _and:{
      user_id: {_eq: $userId},
      organization_id:{_eq:$orgId}
    }
  }) {
    returning {
      user_id
    }
  }
}`;

const HASURA_OPERATION_DEL_USER = `mutation deleteUser($userId: uuid!) {
  delete_user_by_pk(id: $userId) {
    id
  }
}`;

const HASURA_OPERATION_ADD_USER = `
mutation signup($name: String, $email: String, $authId: String ) {
  insert_user_one(object: {
    email: $email, 
    name: $name,
    auth_id: $authId
    }) {
    id
  }
}
`;

const HASURA_OPERATION_ADD_ORG_MEMBER = `
mutation createOrganizationMember($orgId: uuid, $role: String, $userId:uuid){
  insert_organization_member_one(object: {
      organization_id: $orgId, 
      role: $role, 
      user_id: $userId
    }) {
    user_id
  }
}
`;

const HASURA_OPERATION_UPDATE_USER_EMAIL = `mutation ($email: String!, $userId: uuid!) {
  update_user(_set: {email: $email}, where: {id: {_eq: $userId}}) {
    returning {
      id
    }
  }
}`;

const HASURA_OPERATION_UPDATE_USER_NAME = `mutation ($name: String!, $userId: uuid!) {
  update_user(_set: {name: $name}, where: {id: {_eq: $userId}}) {
    returning {
      id
    }
  }
}`;

const HASURA_OPERATION_UPDATE_USER_PROFILE_PICTURE = `mutation ($profilePictureUrl: String!, $userId: uuid!) {
  update_user(_set: {profile_photo: $profilePictureUrl}, where: {id: {_eq: $userId}}) {
    returning {
      id
    }
  }
}`;

module.exports = {
  HASURA_OPERATION_UNLINK_USER_FROM_ORG,
  HASURA_OPERATION_ADD_ORG_MEMBER,
  HASURA_OPERATION_ADD_USER,
  HASURA_OPERATION_DEL_USER,
  HASURA_OPERATION_UPDATE_USER_EMAIL,
  HASURA_OPERATION_UPDATE_USER_NAME,
  HASURA_OPERATION_UPDATE_USER_PROFILE_PICTURE,
};

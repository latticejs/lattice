const HASURA_OPERATION_FETCH_USER_ORGS = `query getOrgMember($userId:uuid, $orgId: uuid){
  organization_member(where: {_and: {
    user_id: {_eq: $userId}, 
    organization_id: { _neq: $orgId }}}) {
    organization_id
  }
}`;

const HASURA_OPERTION_FETCH_USER = `query FetchUser($userId: uuid) {
  user(where: {
    id: {
      _eq: $userId
    }
  }) {
    auth_id
    email
  }
}
`;

const HASURA_CHECK_EMAIL_DUPLICATE_EXISTS = `query ($email: String!, $userId: uuid!) {
  user(where: {
    email: {_eq: $email}, 
    _and: {id: {_neq: $userId}}
  }) {
    id
  }
}`;

module.exports = {
  HASURA_OPERATION_FETCH_USER_ORGS,
  HASURA_OPERTION_FETCH_USER,
  HASURA_CHECK_EMAIL_DUPLICATE_EXISTS,
};

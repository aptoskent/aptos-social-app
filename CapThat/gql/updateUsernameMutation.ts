import { gql } from '@apollo/client';

export const updateUsernameMutation = gql`
  mutation UpdateUsernameMutation($auth_id: String, $username: String) {
    update_user(
      _set: { username: $username }
      where: { auth_id: { _eq: $auth_id } }
    ) {
      affected_rows
      returning {
        username
        auth_id
      }
    }
  }
`;

import { gql } from '@apollo/client';

export const updateEmailMutation = gql`
  mutation UpdateEmailMutation($auth_id: String, $email: String) {
    update_user(
      _set: { email: $email }
      where: { auth_id: { _eq: $auth_id } }
    ) {
      affected_rows
      returning {
        email
        auth_id
      }
    }
  }
`;

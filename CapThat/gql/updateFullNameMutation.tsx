import { gql } from '@apollo/client';

export const updateFullNameMutation = gql`
  mutation UpdateFullNameMutation($auth_id: String, $full_name: jsonb) {
    update_user(
      _set: { full_name: $full_name }
      where: { auth_id: { _eq: $auth_id } }
    ) {
      affected_rows
      returning {
        full_name
        auth_id
      }
    }
  }
`;

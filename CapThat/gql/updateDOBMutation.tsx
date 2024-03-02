import { gql } from '@apollo/client';

export const updateDOBMutation = gql`
  mutation UpdateDOBMutation($auth_id: String, $birthday: date) {
    update_user(
      _set: { birthday: $birthday }
      where: { auth_id: { _eq: $auth_id } }
    ) {
      affected_rows
      returning {
        birthday
        auth_id
      }
    }
  }
`;

import { gql } from '@apollo/client';

export const updateUserInfoMutation = gql`
  mutation UpdateUserInfoMutation(
    $auth_id: String
    $username: String
    $birthday: date
    $full_name: jsonb
    $pronoun: String
    $invite_code: String
  ) {
    update_user(
      _set: {
        username: $username
        birthday: $birthday
        full_name: $full_name
        pronoun: $pronoun
        invite_code: $invite_code
      }
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

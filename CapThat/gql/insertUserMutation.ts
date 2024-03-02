import { gql } from '@apollo/client';

export const insertUserMutation = gql`
  mutation InsertUserMutation(
    $id: uuid
    $phone_number: String
    $username: String
    $auth_id: String
  ) {
    insert_user(
      objects: {
        id: $id
        phone_number: $phone_number
        username: $username
        auth_id: $auth_id
      }
    ) {
      affected_rows
      returning {
        id
        phone_number
        username
        auth_id
      }
    }
  }
`;

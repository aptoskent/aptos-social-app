import { gql } from '@apollo/client';

export const insertPushTokenMutation = gql`
  mutation InsertPushToken(
    $user_id: uuid
    $device_id: String
    $push_token: String
    $is_active: Boolean
  ) {
    insert_push_token(
      objects: {
        user_id: $user_id
        device_id: $device_id
        push_token: $push_token
        is_active: $is_active
      }
    ) {
      affected_rows
      returning {
        id
        push_token
      }
    }
  }
`;

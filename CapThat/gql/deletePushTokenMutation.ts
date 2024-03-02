import { gql } from '@apollo/client';

export const deletePushTokenByDeviceMutation = gql`
  mutation DeletePushTokenByDeviceMutation(
    $push_token: String
    $device_id: String
  ) {
    delete_push_token(
      where: {
        push_token: { _eq: $push_token }
        device_id: { _eq: $device_id }
      }
    ) {
      affected_rows
      returning {
        push_token
      }
    }
  }
`;

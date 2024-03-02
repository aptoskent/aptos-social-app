import { gql } from '@apollo/client';

export const getPushTokensByGroupIdQuery = gql`
  query GetPushTokenByGroupId($user_ids: [uuid!]) {
    push_token(where: { user_id: { _in: $user_ids } }) {
      push_token
    }
  }
`;

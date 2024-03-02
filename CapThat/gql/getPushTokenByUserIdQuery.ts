import { gql } from '@apollo/client';

export const getPushTokenByUserIdQuery = gql`
  query GetPushTokenByUserIdQuery($user_id: uuid) {
    push_token(where: { user_id: { _eq: $user_id } }) {
      push_token
    }
  }
`;

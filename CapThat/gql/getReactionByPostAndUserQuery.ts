import { gql } from '@apollo/client';

export const getReactionByPostAndUserQuery = gql`
  query GetReactionByPostAndUser($post_id: uuid, $user_id: uuid) {
    post(where: { id: { _eq: $post_id } }) {
      reactions(where: { from_user_id: { _eq: $user_id } }) {
        id
        type
        created_at
        from_user_id
      }
    }
  }
`;

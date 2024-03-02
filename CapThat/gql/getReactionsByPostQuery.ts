import { gql } from '@apollo/client';

export const getReactionsByPostQuery = gql`
  query GetReactionsByPostQuery($post_id: uuid, $limit: Int, $offset: Int) {
    post(where: { id: { _eq: $post_id } }) {
      reactions(offset: $offset, limit: $limit) {
        id
        type
        created_at
        from_user {
          id
          username
          full_name
          profile_picture_img_id
        }
      }
    }
  }
`;

export const getReactionCountAndFirstReactorByPostQuery = gql`
  query GetReactionCountAndFirstReactorByPostQuery($post_id: uuid) {
    post(where: { id: { _eq: $post_id } }) {
      reactions_aggregate {
        aggregate {
          count
        }
      }
      reactions(limit: 1) {
        from_user {
          id
          username
        }
      }
    }
  }
`;

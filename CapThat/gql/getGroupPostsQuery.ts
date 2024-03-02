import { gql } from '@apollo/client';

// get all undeleted posts from a group
export const getGroupPostsQuery = gql`
  query GetGroupPosts($group_id: uuid, $limit: Int, $offset: Int) {
    group(where: { id: { _eq: $group_id } }) {
      posts(
        where: { is_deleted: { _eq: false }, is_hidden: { _neq: true } }
        order_by: { created_at: desc }
        offset: $offset
        limit: $limit
      ) {
        id
        photo_post {
          id
          caption
          created_by_user {
            id
            username
          }
          image {
            id
            thumbnail_url
            metadata
          }
        }
        comments_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

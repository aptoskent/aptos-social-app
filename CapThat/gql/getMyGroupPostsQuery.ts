import { gql } from '@apollo/client';

// get all posts from groups that I am a member of
// undeleted group and undeleted post only
export const getMyGroupPostsQuery = gql`
  query GetMyGroupPosts($limit: Int, $offset: Int, $my_group_ids: [uuid!]) {
    post(
      where: {
        group_id: { _in: $my_group_ids }
        is_deleted: { _eq: false }
        is_hidden: { _neq: true }
        group: { is_deleted: { _eq: false } }
      }
      order_by: { created_at: desc }
      offset: $offset
      limit: $limit
    ) {
      id
      type
      photo_post {
        id
        image {
          id
          thumbnail_url
          metadata
        }
        created_by_user {
          id
          username
        }
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

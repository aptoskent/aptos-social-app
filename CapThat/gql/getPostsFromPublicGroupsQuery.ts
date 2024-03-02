import { gql } from '@apollo/client';

// get all undeleted posts from undeleted public groups
export const getPostsFromPublicGroupsWithoutTestGroupsQuery = gql`
  query GetPostsFromPublicGroupsWithoutTestGroupsQuery(
    $limit: Int
    $offset: Int
  ) {
    post(
      where: {
        group: {
          is_private: { _eq: false }
          is_deleted: { _eq: false }
          is_test_group: { _eq: false }
        }
        is_deleted: { _eq: false }
        is_hidden: { _neq: true }
        is_hidden_in_discover: { _neq: true }
      }
      offset: $offset
      limit: $limit
      order_by: { created_at: desc }
    ) {
      id
      type
      created_at
      updated_at
      group_id
      points_gained
      photo_post {
        id
        caption
        created_by_user {
          id
          username
          full_name
          profile_picture_img_id
          profile_picture_image {
            img_url
          }
        }
        image {
          id
          img_url
          original_img_url
          thumbnail_url
          metadata
        }
      }
      group {
        id
        name
        is_private
        is_test_group
        created_by_user_id
        profile_picture_serial_number
        test_group_profile_picture_serial_number
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      reactions_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

// get all undeleted posts from undeleted public groups and test groups
export const getPostsFromPublicGroupsWithTestGroupsQuery = gql`
  query GetPostsFromPublicGroupsWithTestGroupsQuery($limit: Int, $offset: Int) {
    post(
      where: {
        group: { is_private: { _eq: false }, is_deleted: { _eq: false } }
        is_deleted: { _eq: false }
        is_hidden: { _neq: true }
        is_hidden_in_discover: { _neq: true }
      }
      offset: $offset
      limit: $limit
      order_by: { created_at: desc }
    ) {
      id
      type
      created_at
      updated_at
      group_id
      points_gained
      photo_post {
        id
        caption
        created_by_user {
          id
          username
          full_name
          profile_picture_img_id
          profile_picture_image {
            img_url
          }
        }
        image {
          id
          img_url
          original_img_url
          thumbnail_url
          metadata
        }
      }
      group {
        id
        name
        is_private
        is_test_group
        created_by_user_id
        profile_picture_serial_number
        test_group_profile_picture_serial_number
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
      reactions(offset: $offset, limit: $limit) {
        id
        from_user {
          id
        }
      }
      reactions_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`;

import { gql } from '@apollo/client';

export const getPostQuery = gql`
  query GetPost($post_id: uuid) {
    post(where: { id: { _eq: $post_id } }) {
      id
      type
      created_at
      points_gained
      group_id
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
    }
  }
`;

export const getPostAuthorQuery = gql`
  query GetPostAuthor($post_id: uuid) {
    post(where: { id: { _eq: $post_id } }) {
      post_user_edges {
        user_id
      }
    }
  }
`;

import { gql } from '@apollo/client';

export const getCommentsByPostQuery = gql`
  query GetCommentsByPost($post_id: uuid) {
    post(where: { id: { _eq: $post_id } }) {
      comments {
        id
        content
        created_at
        from_user {
          id
          username
          full_name
          profile_picture_img_id
          profile_picture_image {
            img_url
          }
        }
      }
    }
  }
`;

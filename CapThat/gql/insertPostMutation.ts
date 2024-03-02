import { gql } from '@apollo/client';

export const insertPostMutation = gql`
  mutation InsertPost(
    $img_url: String
    $thumbnail_url: String
    $original_img_url: String
    $caption: String
    $type: String
    $points_gained: Int
    $group_id: uuid
    $user_id: uuid
    $image_metadata: jsonb
  ) {
    insert_user_post_edge(
      objects: {
        user_id: $user_id
        post: {
          data: {
            type: $type
            points_gained: $points_gained
            group_id: $group_id
            photo_post: {
              data: {
                caption: $caption
                created_by_user_id: $user_id
                image: {
                  data: {
                    created_by_user_id: $user_id
                    img_url: $img_url
                    thumbnail_url: $thumbnail_url
                    original_img_url: $original_img_url
                    metadata: $image_metadata
                  }
                }
              }
            }
          }
        }
      }
    ) {
      affected_rows
      returning {
        id
        post_id
        user_id
        post {
          id
          created_at
          type
          points_gained
          group_id
          photo_post {
            id
            created_by_user_id
            caption
            image {
              id
              created_at
              created_by_user_id
              img_url
              thumbnail_url
              original_img_url
              metadata
            }
          }
        }
      }
    }
  }
`;

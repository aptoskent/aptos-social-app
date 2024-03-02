import { gql } from '@apollo/client';

export const insertProfileImageMutation = gql`
  mutation insertImage(
    $user_id: uuid
    $image_id: uuid
    $img_url: String
    $original_img_url: String
    $thumbnail_url: String
    $metadata: jsonb
  ) {
    insert_image(
      objects: {
        id: $image_id
        img_url: $img_url
        thumbnail_url: $thumbnail_url
        original_img_url: $original_img_url
        created_by_user_id: $user_id
        metadata: $metadata
      }
    ) {
      affected_rows
      returning {
        id
        img_url
        thumbnail_url
        original_img_url
        created_by_user_id
        metadata
      }
    }
    insert_profile_image(
      objects: {
        id: $image_id
        img_url: $img_url
        thumbnail_url: $thumbnail_url
        original_img_url: $original_img_url
        created_by_user_id: $user_id
        metadata: $metadata
      }
    ) {
      affected_rows
      returning {
        id
        img_url
        thumbnail_url
        original_img_url
        created_by_user_id
        metadata
      }
    }
    update_user(
      where: { id: { _eq: $user_id } }
      _set: { profile_picture_img_id: $image_id }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

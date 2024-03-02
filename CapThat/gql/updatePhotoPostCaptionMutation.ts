import { gql } from '@apollo/client';

export const updatePhotoPostCaptionMutation = gql`
  mutation InsertPhotoPost($photo_post_id: uuid, $updated_caption: String) {
    update_photo_post(
      _set: { caption: $updated_caption }
      where: { id: { _eq: $photo_post_id } }
    ) {
      affected_rows
      returning {
        id
        caption
      }
    }
  }
`;

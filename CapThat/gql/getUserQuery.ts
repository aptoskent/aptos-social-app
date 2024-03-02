import { gql } from '../__generated__/gql';

export const getUserQuery = gql(`
  query GetUserQuery($user_id: uuid) {
    user(where: { id: { _eq: $user_id } }) {
      id
      username
      birthday
      full_name
      pronoun
      email
      phone_number
      profile_picture_img_id
      profile_picture_image {
        img_url
      }
      is_test_user
    }
  }
`);

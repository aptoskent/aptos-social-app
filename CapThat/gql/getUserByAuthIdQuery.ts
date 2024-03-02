import { gql } from '@apollo/client';

export const getUserByAuthIdQuery = gql`
  query GetUserByAuthIdQuery($auth_id: String) {
    user(where: { auth_id: { _eq: $auth_id } }) {
      id
      username
      birthday
      full_name
      pronoun
      email
      phone_number
      profile_picture_img_id
    }
  }
`;

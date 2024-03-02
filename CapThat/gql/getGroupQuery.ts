import { gql } from '../__generated__';

export const getGroupQuery = gql(`
  query GetGroupQuery($group_id: uuid) {
    group(where: { id: { _eq: $group_id } }) {
      id
      name
      is_private
      is_test_group
      profile_picture_serial_number
      test_group_profile_picture_serial_number
      profile_image {
        id
        img_url
        serial_number
        background_colors
      }
      test_group_profile_image {
        id
        img_url
        serial_number
        background_colors
      }
      group_user_edges {
        user {
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
`);

export const getMembersForGroupIdQuery = gql(`
  query GetMembersForGroupIdQuery($group_id: uuid) {
    group(where: { id: { _eq: $group_id } }) {
      id
      name
      group_user_edges {
        user {
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
`);

export const getGroupNameQuery = gql(`
  query GetGroupNameQuery($group_id: uuid) {
    group(where: { id: { _eq: $group_id } }) {
      name
    }
  }
`);

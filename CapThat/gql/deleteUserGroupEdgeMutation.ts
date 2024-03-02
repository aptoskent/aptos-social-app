import { gql } from '@apollo/client';

export const deleteTestUserGroupEdgedMutation = gql`
  mutation DeleteTestUserGroupEdge($user_id: uuid, $group_id: uuid) {
    delete_user_group_edge(
      where: { user_id: { _eq: $user_id }, group_id: { _eq: $group_id } }
    ) {
      affected_rows
      returning {
        id
        user_id
        group_id
      }
    }
  }
`;

// use this when last person leaves the group, essentially deleting the group
export const deleteTestUserGroupEdgedAndDeleteGroupMutation = gql`
  mutation DeleteTestUserGroupEdgeAndUpdateGroup(
    $user_id: uuid
    $group_id: uuid
  ) {
    delete_user_group_edge(
      where: { user_id: { _eq: $user_id }, group_id: { _eq: $group_id } }
    ) {
      affected_rows
      returning {
        id
        user_id
        group_id
      }
    }
    update_group(
      _set: { is_deleted: true }
      where: { id: { _eq: $group_id } }
    ) {
      affected_rows
    }
  }
`;

export const deleteNonTestUserGroupEdgedMutation = gql`
  mutation DeleteUserGroupEdge($user_id: uuid, $group_id: uuid) {
    delete_user_group_edge(
      where: { user_id: { _eq: $user_id }, group_id: { _eq: $group_id } }
    ) {
      affected_rows
      returning {
        id
        user_id
        group_id
      }
    }
  }
`;

// use this when last person leaves the group, essentially deleting the group
export const deleteNonTestUserGroupEdgedAndDeleteGroupMutation = gql`
  mutation DeleteUserGroupEdgeAndUpdateGroup(
    $user_id: uuid
    $group_id: uuid
    $profile_picture_img_id: Int
    $profile_picture_img_url: String
    $profile_picture_serial_number: Int
    $profile_picture_background_colors: jsonb
  ) {
    delete_user_group_edge(
      where: { user_id: { _eq: $user_id }, group_id: { _eq: $group_id } }
    ) {
      affected_rows
      returning {
        id
        user_id
        group_id
      }
    }
    update_group(
      _set: { is_deleted: true }
      where: { id: { _eq: $group_id } }
    ) {
      affected_rows
    }
    delete_mascot_image_used(where: { id: { _eq: $profile_picture_img_id } }) {
      affected_rows
    }
    insert_mascot_image_unused(
      objects: {
        img_url: $profile_picture_img_url
        serial_number: $profile_picture_serial_number
        background_colors: $profile_picture_background_colors
      }
    ) {
      affected_rows
    }
  }
`;

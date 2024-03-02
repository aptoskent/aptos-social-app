import { gql } from '@apollo/client';

export const insertTestGroupMutation = gql`
  mutation InsertTestGroupMutation(
    $user_id: uuid
    $name: String
    $is_private: Boolean
    $test_group_profile_picture_serial_number: Int
  ) {
    insert_user_group_edge(
      objects: {
        user_id: $user_id
        group: {
          data: {
            name: $name
            is_private: $is_private
            is_test_group: true
            created_by_user_id: $user_id
            test_group_profile_picture_serial_number: $test_group_profile_picture_serial_number
          }
        }
      }
    ) {
      affected_rows
      returning {
        user_id
        group {
          id
          name
          is_private
          is_test_group
          created_by_user_id
        }
      }
    }
  }
`;

export const insertNonTestGroupMutation = gql`
  mutation InsertNonTestGroupMutation(
    $group_id: uuid
    $user_id: uuid
    $name: String
    $is_private: Boolean
    $profile_picture_img_id: Int
    $profile_picture_serial_number: Int
    $profile_picture_img_url: String
    $profile_picture_background_colors: jsonb
  ) {
    delete_mascot_image_unused(
      where: { id: { _eq: $profile_picture_img_id } }
    ) {
      affected_rows
    }
    insert_mascot_image_used(
      objects: {
        img_url: $profile_picture_img_url
        serial_number: $profile_picture_serial_number
        background_colors: $profile_picture_background_colors
      }
    ) {
      affected_rows
    }
    insert_user_group_edge(
      objects: {
        user_id: $user_id
        group: {
          data: {
            name: $name
            is_private: $is_private
            is_test_group: false
            created_by_user_id: $user_id
            profile_picture_serial_number: $profile_picture_serial_number
          }
        }
      }
    ) {
      affected_rows
      returning {
        user_id
        group {
          id
          name
          is_private
          is_test_group
          created_by_user_id
        }
      }
    }
  }
`;

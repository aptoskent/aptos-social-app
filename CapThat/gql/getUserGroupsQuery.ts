import { gql } from '@apollo/client';

export const getUserGroupsWithoutTestingGroupsQuery = gql`
  query GetUserGroupsWithoutTestingGroupsQuery($user_id: uuid) {
    user(where: { id: { _eq: $user_id } }) {
      user_group_edges(
        where: {
          group: {
            is_deleted: { _eq: false }
            is_private: { _eq: false }
            is_test_group: { _eq: false }
          }
        }
      ) {
        user_id
        group_id
        group {
          id
          is_private
          is_test_group
          name
          profile_picture_serial_number
          test_group_profile_picture_serial_number
          created_by_user_id
        }
      }
    }
  }
`;

export const getUserGroupsWithTestingGroupsQuery = gql`
  query GetUserGroupsWithTestingGroupsQuery($user_id: uuid) {
    user(where: { id: { _eq: $user_id } }) {
      user_group_edges(
        where: {
          group: { is_deleted: { _eq: false }, is_private: { _eq: false } }
        }
      ) {
        user_id
        group_id
        group {
          id
          is_private
          is_test_group
          name
          profile_picture_serial_number
          test_group_profile_picture_serial_number
          created_by_user_id
        }
      }
    }
  }
`;

export const getMyGroupsQuery = gql`
  query GetMyGroups($user_id: uuid) {
    user(where: { id: { _eq: $user_id } }) {
      user_group_edges(where: { group: { is_deleted: { _eq: false } } }) {
        user_id
        group_id
        group {
          id
          is_private
          is_test_group
          name
          profile_picture_serial_number
          test_group_profile_picture_serial_number
          created_by_user_id
        }
      }
    }
  }
`;

export const getMyGroupCountQuery = gql`
  query GetMyGroupCount($user_id: uuid) {
    user(where: { id: { _eq: $user_id } }) {
      user_group_edges_aggregate(
        where: { group: { is_deleted: { _eq: false } } }
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;

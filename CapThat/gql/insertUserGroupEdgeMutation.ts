import { gql } from '@apollo/client';

export const insertUserGroupEdgeMutation = gql`
  mutation InsertUserGroupEdge($group_id: uuid, $user_id: uuid) {
    insert_user_group_edge(
      objects: { group_id: $group_id, user_id: $user_id }
    ) {
      affected_rows
      returning {
        group_id
        id
        user_id
      }
    }
  }
`;

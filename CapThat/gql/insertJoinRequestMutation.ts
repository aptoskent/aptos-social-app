import { gql } from '@apollo/client';

export const insertJoinRequestMutation = gql`
  mutation JoinRequest($groupId: uuid, $userId: uuid) {
    insert_group_join_request(
      objects: { group_id: $groupId, user_id: $userId }
    ) {
      affected_rows
    }
  }
`;

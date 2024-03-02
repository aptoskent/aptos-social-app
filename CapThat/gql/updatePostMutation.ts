import { gql } from '@apollo/client';

export const updatePostAsDeletedMutation = gql`
  mutation UpdatePostAsDeleted($post_id: uuid) {
    update_post(_set: { is_deleted: true }, where: { id: { _eq: $post_id } }) {
      affected_rows
    }
  }
`;

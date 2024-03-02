import { gql } from '@apollo/client';

export const insertPostReportMutation = gql`
  mutation ReportPost($post_id: uuid, $reported_by_user_id: uuid) {
    insert_reported_post(
      objects: { post_id: $post_id, reported_by_user_id: $reported_by_user_id }
    ) {
      affected_rows
    }
  }
`;

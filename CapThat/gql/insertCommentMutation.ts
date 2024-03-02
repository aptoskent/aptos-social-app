import { gql } from '@apollo/client';

export const insertCommentMutation = gql`
  mutation InsertComment(
    $content: String
    $post_id: uuid
    $from_user_id: uuid
  ) {
    insert_comment(
      objects: {
        content: $content
        post_id: $post_id
        from_user_id: $from_user_id
      }
    ) {
      affected_rows
      returning {
        id
        content
        created_at
        post_id
        from_user_id
      }
    }
  }
`;

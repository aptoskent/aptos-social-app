import { gql } from '@apollo/client';

export const insertReactionMutation = gql`
  mutation InsertReaction(
    $reaction_type: String
    $post_id: uuid
    $from_user_id: uuid
  ) {
    insert_reaction(
      objects: {
        type: $reaction_type
        post_id: $post_id
        from_user_id: $from_user_id
      }
    ) {
      affected_rows
      returning {
        id
        type
        created_at
        post_id
        from_user_id
      }
    }
  }
`;

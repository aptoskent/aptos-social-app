import { gql } from '@apollo/client';

export const deleteReactionMutation = gql`
  mutation DeleteReaction($reaction_id: uuid) {
    delete_reaction(where: { id: { _eq: $reaction_id } }) {
      affected_rows
    }
  }
`;

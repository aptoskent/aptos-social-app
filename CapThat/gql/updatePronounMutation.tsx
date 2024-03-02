import { gql } from '@apollo/client';

export const updatePronounMutation = gql`
  mutation UpdatePronounMutation($auth_id: String, $pronoun: String) {
    update_user(
      _set: { pronoun: $pronoun }
      where: { auth_id: { _eq: $auth_id } }
    ) {
      affected_rows
      returning {
        pronoun
        auth_id
      }
    }
  }
`;

import { gql } from '@apollo/client';

export const updatePhoneNumberMutation = gql`
  mutation UpdatePhoneNumberMutation($auth_id: String, $phone_number: String) {
    update_user(
      _set: { phone_number: $phone_number }
      where: { auth_id: { _eq: $auth_id } }
    ) {
      affected_rows
      returning {
        phone_number
        auth_id
      }
    }
  }
`;

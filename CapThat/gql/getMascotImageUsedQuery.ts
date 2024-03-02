import { gql } from '@apollo/client';

export const getMascotImagesUsedQuery = gql`
  query GetMascotImagesUsedQuery($serial_number: Int) {
    mascot_image_used(where: { serial_number: { _eq: $serial_number } }) {
      id
      img_url
      serial_number
    }
  }
`;

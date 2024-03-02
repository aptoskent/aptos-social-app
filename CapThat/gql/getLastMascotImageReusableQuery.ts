import { gql } from '@apollo/client';

export const getMascotImagesReusableQuery = gql`
  query GetMascotImagesReusableQuery {
    mascot_image_reusable(limit: 5, order_by: { updated_at: asc }) {
      id
      img_url
      serial_number
      background_colors
    }
  }
`;

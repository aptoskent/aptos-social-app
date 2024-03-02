import { gql } from '@apollo/client';

export const getMascotImagesUnusedRandomlyQuery = gql`
  query GetMascotImagesUnusedRandomly($random_id: Int) {
    mascot_image_unused(
      where: { id: { _gte: $random_id } }
      order_by: { id: asc }
      limit: 5
    ) {
      id
      img_url
      serial_number
      background_colors
    }
  }
`;

export const getLastMascotImageUnusedQuery = gql`
  query GetLastMascotImageUnused {
    mascot_image_unused(order_by: { id: desc }, limit: 1) {
      id
    }
  }
`;

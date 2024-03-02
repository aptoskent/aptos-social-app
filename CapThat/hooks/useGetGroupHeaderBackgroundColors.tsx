import { gql, useQuery as useGraphqlQuery } from '@apollo/client';
import { colors } from '../colors';
import { useEffect, useState } from 'react';

const mascotQuery = gql`
  query GetMascotImagesUsed($serial_number: Int) {
    mascot_image_used(where: { serial_number: { _eq: $serial_number } }) {
      id
      img_url
      serial_number
      background_colors
    }
  }
`;

export type BackgroundColors = {
  primary: string;
  secondary: string;
};

export const useGetGroupHeaderBackgroundColors = (
  groupMascotSerialNumber: number,
): BackgroundColors => {
  const [mascotData, setMascotData] = useState<{
    background_colors: BackgroundColors;
  } | null>(null);

  const { loading, error, refetch } = useGraphqlQuery(mascotQuery, {
    variables: { serial_number: groupMascotSerialNumber || 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await refetch();
        setMascotData(data.data.mascot_image_used[0]);
      } catch (error) {
        // Handle error if necessary
      }
    };

    fetchData();
  }, [groupMascotSerialNumber, refetch]);

  if (loading || error) {
    return colors.darkGreyGradientColors;
  }

  if (!mascotData || !mascotData.background_colors) {
    return colors.darkGreyGradientColors;
  }

  return mascotData.background_colors;
};

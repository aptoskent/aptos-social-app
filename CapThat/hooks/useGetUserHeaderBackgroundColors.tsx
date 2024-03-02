import { gql, useQuery as useGraphqlQuery } from '@apollo/client';
import { colors } from '../colors';
import { getInitials } from '../components/profile_picture/helpers';

const userQuery = gql`
  query GetUserById($user_id: uuid) {
    user(where: { id: { _eq: $user_id } }) {
      id
      username
      full_name
    }
  }
`;

function getColors(initials = 'MH'): BackgroundColors {
  const { secondaryGradientColors } = colors;
  const colorsList = Object.values(secondaryGradientColors);
  const index = initials.charCodeAt(0) % colorsList.length;
  return colorsList[index];
}

type BackgroundColors = {
  primary: string;
  secondary: string;
};

export const useGetUserHeaderBackgroundColors = (
  userId: string,
): BackgroundColors => {
  const { loading, error, data } = useGraphqlQuery(userQuery, {
    variables: { user_id: userId },
  });

  if (loading || error || !data) {
    return colors.darkGreyGradientColors;
  }

  const userData = data.user[0];
  const initials = getInitials(userData);
  return getColors(initials);
};

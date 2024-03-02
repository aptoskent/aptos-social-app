import { Image, Text, View } from 'react-native';
import { TEXT_COLOR_PRIMARY } from '../text/constants';
import { User } from '../gallery/dataHelper';
import { colors } from '../../colors';
import { getInitials } from './helpers';
import { useDownloadUrlForImage } from '../../hooks/useDownloadUrlForImage';
import { GetGroupQueryQuery } from '../../__generated__/graphql';

const BORDER_COLOR = '#DDE8E8';
export const WIDTH_MEDIUM = 54;
const WIDTH_LARGE = 88;
const WIDTH_SMALL = 20;
const WIDTH_ROUND = 40;
const BORDER_RADIUS_SMALL = 6;
const BORDER_RADIUS_MEDIUM = 14;
const BORDER_RADIUS_LARGE = 14;

export enum UserPfpSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ROUND = 'round',
}

function getWidth(size: UserPfpSize) {
  switch (size) {
    case UserPfpSize.SMALL:
      return WIDTH_SMALL;
    case UserPfpSize.MEDIUM:
      return WIDTH_MEDIUM;
    case UserPfpSize.LARGE:
      return WIDTH_LARGE;
    case UserPfpSize.ROUND:
      return WIDTH_ROUND;
  }
}

function getBorderRadius(size: UserPfpSize) {
  switch (size) {
    case UserPfpSize.SMALL:
      return BORDER_RADIUS_SMALL;
    case UserPfpSize.MEDIUM:
      return BORDER_RADIUS_MEDIUM;
    case UserPfpSize.LARGE:
      return BORDER_RADIUS_LARGE;
    case UserPfpSize.ROUND:
      return WIDTH_ROUND / 2;
  }
}

function getBorderWidth(size: UserPfpSize) {
  switch (size) {
    case UserPfpSize.SMALL:
      return 1;
    case UserPfpSize.MEDIUM:
      return 0;
    case UserPfpSize.LARGE:
      return 2;
    case UserPfpSize.ROUND:
      return 0;
  }
}

function getInitialFontSize(size: UserPfpSize) {
  switch (size) {
    case UserPfpSize.SMALL:
      return 9;
    case UserPfpSize.MEDIUM:
      return 24;
    case UserPfpSize.LARGE:
      return 36;
    case UserPfpSize.ROUND:
      return 14;
  }
}

function getBackgroundColor(initials: string): string {
  const { secondaryColors } = colors;
  const colorsList = Object.values(secondaryColors);
  const index = initials.charCodeAt(0) % colorsList.length;
  return colorsList[index];
}

type UserProfilePictureProps = {
  size: UserPfpSize;
  userData: GetGroupQueryQuery['group'][0]['group_user_edges'][0]['user'];
};

export default function UserProfilePicture({
  size,
  userData,
}: UserProfilePictureProps) {
  const width = getWidth(size);
  const borderRadius = getBorderRadius(size);
  const borderSize = getBorderWidth(size);

  const { downloadUrl: imageUri } = useDownloadUrlForImage(
    userData?.profile_picture_image?.img_url,
  );

  return (
    <Image
      source={{ uri: imageUri }}
      style={{
        width: width,
        height: width,
        backgroundColor: 'gray',
        borderRadius: borderRadius,
        borderColor: BORDER_COLOR,
        borderWidth: borderSize,
      }}
    />
  );
}

type UserProfilePictureDefaultProps = {
  size: UserPfpSize;
  initials: string | undefined;
};

export function UserProfilePictureDefault({
  size,
  initials,
}: UserProfilePictureDefaultProps) {
  const width = getWidth(size);
  const borderRadius = getBorderRadius(size);
  const borderSize = getBorderWidth(size);
  const fontSize = getInitialFontSize(size);

  if (!initials) {
    return null;
  }

  return (
    <View
      style={{
        width: width,
        height: width,
        backgroundColor: getBackgroundColor(initials),
        borderRadius: borderRadius,
        borderColor: BORDER_COLOR,
        borderWidth: borderSize,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: 'clash-display-bold',
          color: TEXT_COLOR_PRIMARY,
          fontSize: fontSize,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {initials?.toUpperCase()}
      </Text>
    </View>
  );
}

type UserProfilePictureWithFallback = {
  size: UserPfpSize;
  userData: User;
};

export function UserProfilePictureWithFallback(
  props: UserProfilePictureWithFallback,
) {
  const { size, userData } = props;

  const hasProfilePicture = userData?.profile_picture_image?.img_url;

  if (hasProfilePicture) {
    return <UserProfilePicture size={size} userData={userData} />;
  }

  return (
    <UserProfilePictureDefault size={size} initials={getInitials(userData)} />
  );
}

import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SupportingText from '../text/SupportingText';
import Icon from 'react-native-remix-icon';
import UserProfilePicture, {
  UserPfpSize,
  UserProfilePictureDefault,
  WIDTH_MEDIUM,
} from './UserProfilePicture';
import {
  SCREEN_NAME_GROUP_MEMBER_SELECTION,
  SCREEN_NAME_MY_PROFILE,
  SCREEN_NAME_USER_PROFILE,
} from '../../nav/constants';
import { User } from '../gallery/dataHelper';
import { getInitials } from './helpers';
import { BackgroundColors } from '../../hooks/useGetGroupHeaderBackgroundColors';
import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { GetGroupQueryQuery } from '../../__generated__/graphql';

const WIDTH = 54;

type UserProfilePictureMediumProps = {
  userData: GetGroupQueryQuery['group'][0]['group_user_edges'][0]['user'];
};

// TODO: take care of when the name is too long
export default function UserProfileTouchableMedium({
  userData,
}: UserProfilePictureMediumProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);

  const goToUserScreen = () => {
    if (!userData) {
      console.warn('No user data');
      return;
    }
    // TODO: @jianyi move this to helper function
    if (userId === userData.id) {
      navigation.navigate(SCREEN_NAME_MY_PROFILE);
    } else {
      navigation.navigate(SCREEN_NAME_USER_PROFILE, {
        userId: userData.id,
        username: userData.username,
      });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={goToUserScreen}>
      {userData?.profile_picture_img_id ? (
        <UserProfilePicture size={UserPfpSize.MEDIUM} userData={userData} />
      ) : (
        <UserProfilePictureDefault
          size={UserPfpSize.MEDIUM}
          initials={getInitials(userData)}
        />
      )}
      <SupportingText singleLine maxWidth={WIDTH_MEDIUM}>
        {userData?.username}
      </SupportingText>
    </TouchableOpacity>
  );
}

type GroupScreenUserProfilePictureMoreButtonProps = {
  groupName: string;
  headerColors: BackgroundColors;
  numOfMembersMore: number;
  members: GetGroupQueryQuery['group'][0]['group_user_edges'][0]['user'][];
};

export function GroupScreenUserProfilePictureMoreButton({
  groupName,
  headerColors,
  numOfMembersMore,
  members,
}: GroupScreenUserProfilePictureMoreButtonProps) {
  const navigation = useTypedNavigation();
  if (!numOfMembersMore || numOfMembersMore === 0) {
    return null;
  }

  const goToAllUsersScreen = () => {
    navigation.navigate(SCREEN_NAME_GROUP_MEMBER_SELECTION, {
      groupName: groupName,
      headerColors: headerColors,
      members: members,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={goToAllUsersScreen}>
      <View style={styles.buttonView}>
        <Icon name="team-fill" size="22" color="white" />
      </View>
      <SupportingText>{`${numOfMembersMore} more`}</SupportingText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  buttonView: {
    width: WIDTH,
    height: WIDTH,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
  },
});

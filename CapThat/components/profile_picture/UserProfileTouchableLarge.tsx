import { StyleSheet, TouchableOpacity } from 'react-native';
import UserProfilePicture, {
  UserPfpSize,
  UserProfilePictureDefault,
} from './UserProfilePicture';
import { User } from '../gallery/dataHelper';
import { getInitials } from './helpers';

import {
  SCREEN_NAME_CAMERA,
  SCREEN_NAME_CREATE_NAV,
} from '../../nav/constants';
import { ActionType } from '../../screens/camera/ActionType';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type UserProfileTouchableLargeProps = {
  userData: User;
};

// TODO: add edit pfp icon
export default function UserProfileTouchableLarge({
  userData,
}: UserProfileTouchableLargeProps) {
  const navigation = useTypedNavigation();
  const changeProfilePicture = () => {
    navigation.navigate(SCREEN_NAME_CREATE_NAV, {
      screen: SCREEN_NAME_CAMERA,
      params: { actionType: ActionType.UPLOAD_PROFILE_PHOTO },
      reset: true,
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={changeProfilePicture}>
      {userData.profile_picture_img_id ? (
        <UserProfilePicture size={UserPfpSize.LARGE} userData={userData} />
      ) : (
        <UserProfilePictureDefault
          size={UserPfpSize.LARGE}
          initials={getInitials(userData)}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    // todo: zIndex should be at parent level to make this component more reusuable.
    zIndex: 2000,
  },
});

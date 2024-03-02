import { StyleSheet, TouchableOpacity } from 'react-native';
import UserProfilePicture, {
  UserPfpSize,
  UserProfilePictureDefault,
} from './UserProfilePicture';
import {
  SCREEN_NAME_MY_PROFILE,
  SCREEN_NAME_USER_PROFILE,
} from '../../nav/constants';
import { User } from '../gallery/dataHelper';
import { getInitials } from './helpers';
import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type UserProfileTouchableSmallProps = {
  userData: User;
};

export default function UserProfileTouchableSmall({
  userData,
}: UserProfileTouchableSmallProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);
  const goToUserScreen = () => {
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
      {userData.profile_picture_img_id ? (
        <UserProfilePicture size={UserPfpSize.SMALL} userData={userData} />
      ) : (
        <UserProfilePictureDefault
          size={UserPfpSize.SMALL}
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
  },
});

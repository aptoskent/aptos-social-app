import { NavigationProp } from '@react-navigation/native';
import { ParamList } from '../nav/types';

// Screens
import {
  SCREEN_NAME_GROUP,
  SCREEN_NAME_MY_PROFILE,
  SCREEN_NAME_USER_PROFILE,
} from '../nav/constants';

export const navigateToGroupScreen = (
  navigation: NavigationProp<ParamList>,
  groupId: string,
) => {
  navigation.navigate(SCREEN_NAME_GROUP, {
    groupId,
  });
};

// todo: update to get username at profile screen. update to determine currentuser at profile screen,
export const navigateToProfilescreen = (
  navigation: NavigationProp<ParamList>,
  userId: string,
  username: string,
  isCurrentUser: boolean,
) => {
  if (isCurrentUser) {
    navigation.navigate(SCREEN_NAME_MY_PROFILE);
  } else {
    navigation.navigate(SCREEN_NAME_USER_PROFILE, {
      userId,
      username,
    });
  }
};

import { GetGroupQueryQuery } from '../__generated__/graphql';
import { UserInfo } from '../auth/utils';
import { Group, Post, User } from '../components/gallery/dataHelper';
import { BackgroundColors } from '../hooks/useGetGroupHeaderBackgroundColors';
import { ActionType } from '../screens/camera/ActionType';
import { GroupActionType } from '../screens/group/GroupActionType';
import {
  SCREEN_NAME_ACCOUNT_SETTING,
  SCREEN_NAME_BIRTHDAY_SETTING,
  SCREEN_NAME_CAMERA,
  SCREEN_NAME_CAMERA_ROLL,
  SCREEN_NAME_CREATE_NAV,
  SCREEN_NAME_DOB,
  SCREEN_NAME_EDIT_POST,
  SCREEN_NAME_EMAIL,
  SCREEN_NAME_EMAIL_SETTING,
  SCREEN_NAME_FEED,
  SCREEN_NAME_FEED_NAV,
  SCREEN_NAME_FULLNAME,
  SCREEN_NAME_GROUP,
  SCREEN_NAME_GROUP_CREATION,
  SCREEN_NAME_GROUP_INVITATION,
  SCREEN_NAME_GROUP_MEMBER_SELECTION,
  SCREEN_NAME_GROUP_SELECTION,
  SCREEN_NAME_HOME_TAB_NAV,
  SCREEN_NAME_INVITE_CODE,
  SCREEN_NAME_LAUNCH,
  SCREEN_NAME_LOGGED_IN_NAV,
  SCREEN_NAME_LOGIN,
  SCREEN_NAME_MY_PROFILE,
  SCREEN_NAME_MY_PROFILE_NAV,
  SCREEN_NAME_NAME_SETTING,
  SCREEN_NAME_NOTIFICATION_PERMISSION,
  SCREEN_NAME_POST,
  SCREEN_NAME_POST_LIKE_LIST,
  SCREEN_NAME_PREVIEW_POST,
  SCREEN_NAME_PRONOUN,
  SCREEN_NAME_PRONOUN_SETTING,
  SCREEN_NAME_REGISTRATION,
  SCREEN_NAME_SPLASH,
  SCREEN_NAME_USERNAME,
  SCREEN_NAME_USERNAME_SETTING,
  SCREEN_NAME_USER_AUTH_NAV,
  SCREEN_NAME_USER_PROFILE,
  SCREEN_NAME_VERIFYING,
} from './constants';

export type ParamList = {
  [SCREEN_NAME_HOME_TAB_NAV]: undefined;
  [SCREEN_NAME_USER_AUTH_NAV]: undefined;
  [SCREEN_NAME_LOGGED_IN_NAV]: undefined;
  [SCREEN_NAME_FEED_NAV]: undefined;
  [SCREEN_NAME_CREATE_NAV]: {
    screen: string;
    params: {
      actionType: ActionType;
      // TODO: Why is reset used in params and outside?
      // See GroupScreenView and UserProfileTouchableLarge
      groupId?: string;
      reset?: boolean;
    };
    reset?: boolean;
  };
  [SCREEN_NAME_MY_PROFILE_NAV]: undefined;
  [SCREEN_NAME_FEED]: undefined;
  [SCREEN_NAME_CAMERA]: {
    action: ActionType;
    groupId?: string;
  };
  [SCREEN_NAME_CAMERA_ROLL]: {
    action: ActionType;
    groupId?: string;
  };
  [SCREEN_NAME_PREVIEW_POST]: {
    imageUri: string;
    action: ActionType;
    groupId?: string;
  };
  [SCREEN_NAME_GROUP]: {
    groupId: string;
    groupAction?: GroupActionType;
  };
  [SCREEN_NAME_GROUP_SELECTION]: {
    userId: string;
    username: string;
  };
  [SCREEN_NAME_GROUP_MEMBER_SELECTION]: {
    groupName: string;
    headerColors: BackgroundColors;
    members: GetGroupQueryQuery['group'][0]['group_user_edges'][0]['user'][];
  };
  [SCREEN_NAME_GROUP_INVITATION]: {
    groupData: GetGroupQueryQuery['group'][0];
  };
  [SCREEN_NAME_GROUP_CREATION]: {
    submitPost?: (groupId: string) => void;
  };
  [SCREEN_NAME_USER_PROFILE]: {
    userId: string;
    username: string;
  };
  [SCREEN_NAME_MY_PROFILE]: undefined;
  [SCREEN_NAME_POST]: {
    postId: string;
    source?: string;
  };
  [SCREEN_NAME_POST_LIKE_LIST]: {
    postId: string;
  };
  [SCREEN_NAME_EDIT_POST]: {
    post: Post;
  };
  [SCREEN_NAME_LOGIN]: undefined;
  [SCREEN_NAME_DOB]: {
    inviteCode: string;
  };
  [SCREEN_NAME_FULLNAME]: {
    userInfo: UserInfo;
  };
  [SCREEN_NAME_USERNAME]: {
    userInfo: UserInfo;
  };
  [SCREEN_NAME_PRONOUN]: {
    userInfo: UserInfo;
  };
  [SCREEN_NAME_REGISTRATION]: undefined;
  [SCREEN_NAME_VERIFYING]: {
    phoneNumber: string;
  };
  [SCREEN_NAME_ACCOUNT_SETTING]: undefined;
  [SCREEN_NAME_NAME_SETTING]: {
    firstName: string;
    lastName: string;
  };
  [SCREEN_NAME_USERNAME_SETTING]: {
    username: string;
  };
  [SCREEN_NAME_EMAIL_SETTING]: {
    email: string | null | undefined;
  };
  [SCREEN_NAME_BIRTHDAY_SETTING]: {
    birthday: string;
  };
  [SCREEN_NAME_PRONOUN_SETTING]: {
    pronoun: string | null | undefined;
  };
  [SCREEN_NAME_LAUNCH]: undefined;
  [SCREEN_NAME_INVITE_CODE]: undefined;
  [SCREEN_NAME_NOTIFICATION_PERMISSION]: undefined;
  [SCREEN_NAME_SPLASH]: undefined;
  [SCREEN_NAME_EMAIL]: undefined;
};

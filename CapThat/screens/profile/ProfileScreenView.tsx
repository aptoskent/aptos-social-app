import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Heading1 from '../../components/text/Heading1';
import ProfileScreenGroupsView from './ProfileScreenGroupsView';
import {
  UserProfilePictureWithFallback,
  UserPfpSize,
} from '../../components/profile_picture/UserProfilePicture';
import { User } from '../../components/gallery/dataHelper';
import { useCallback, useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { getUserQuery } from '../../gql/getUserQuery';
import Heading3 from '../../components/text/Heading3';
import MainScreenScrollView from '../../components/main_screen/MainScreenScrollView';
import { Group, UserGroupEdge } from '../../components/gallery/dataHelper';
import {
  getMyGroupsQuery,
  getUserGroupsWithTestingGroupsQuery,
  getUserGroupsWithoutTestingGroupsQuery,
} from '../../gql/getUserGroupsQuery';
import { AuthContext } from '../../auth/AuthContext';
import { ProfileScreenType } from '../../components/main_screen/ProfileScreenType';
import Icon from 'react-native-remix-icon';
import {
  SCREEN_NAME_CAMERA,
  SCREEN_NAME_CREATE_NAV,
} from '../../nav/constants';
import { ActionType } from '../camera/ActionType';
import { TypedToast } from '../../components/TypedToast';
import { ToastType } from '../../components/TypedToast';

// style
import tw from '../../tailwind';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type ProfileScreenViewProps = {
  userId: string;
};

export default function ProfileScreenView({ userId }: ProfileScreenViewProps) {
  const navigation = useTypedNavigation();
  const { userId: loggedInUserId, user } = useContext(AuthContext);

  const [profileOwner, setProfileOwner] = useState<User | null>(null);
  // groups that the user is a member of, if it's logged in user, then it's all groups, otherwise it's only public groups
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const isOwner = loggedInUserId === userId;

  const changeProfilePicture = useCallback(() => {
    navigation.navigate(SCREEN_NAME_CREATE_NAV, {
      screen: SCREEN_NAME_CAMERA,
      params: { actionType: ActionType.UPLOAD_PROFILE_PHOTO },
      reset: true,
    });
  }, [navigation]);

  const { loading: getUserGroupsLoading, error: getUserGroupsError } = useQuery(
    isOwner
      ? getMyGroupsQuery
      : user?.is_test_user
      ? getUserGroupsWithTestingGroupsQuery
      : getUserGroupsWithoutTestingGroupsQuery,
    {
      skip: !userId,
      variables: { user_id: userId },
      onCompleted: (data) => {
        if (data.user.length !== 1) {
          TypedToast.show({ type: ToastType.ERROR });
        }
        const userGroupEdges: UserGroupEdge[] = data.user[0].user_group_edges;
        const groupDataList = userGroupEdges
          .map((edge) => edge.group)
          .filter((group) => {
            if (isOwner) {
              return true;
            } else {
              return group.is_private === false;
            }
          });

        setUserGroups(groupDataList);
      },
    },
  );

  const { loading: getUserLoading, error: getUserError } = useQuery(
    getUserQuery,
    {
      skip: !userId,
      variables: {
        user_id: userId,
      },
      onCompleted: (data) => {
        if (data.user.length !== 1) {
          TypedToast.show({ type: ToastType.ERROR });
        }
        const user: User = data.user[0];
        setProfileOwner(user);
      },
    },
  );

  if (getUserError || getUserGroupsError) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  if (getUserLoading || getUserGroupsLoading) {
    return <View />;
  }

  if (!profileOwner) {
    return <View />;
  }

  const titleAndGroupsComponent = (
    <>
      <View style={styles.titleContainer}>
        <Heading1>{profileOwner.username}</Heading1>
        <Heading3>{`${profileOwner.full_name.first_name} ${profileOwner?.full_name.last_name}`}</Heading3>
      </View>
      <View style={styles.groupsContainer}>
        <ProfileScreenGroupsView
          profileId={profileOwner.id}
          username={profileOwner.username}
          groups={userGroups}
        />
      </View>
    </>
  );

  const profilePictureComponent = () => {
    const hasProfilePicture = !!profileOwner?.profile_picture_img_id;

    return (
      <TouchableOpacity onPress={changeProfilePicture}>
        <UserProfilePictureWithFallback
          userData={profileOwner}
          size={UserPfpSize.LARGE}
        />
        {isOwner && !hasProfilePicture && (
          <View
            style={tw(
              'absolute h-9 w-9 bg-text-default justify-center items-center rounded-full right--3 border-background border-2',
              { bottom: -11.2 },
            )}
          >
            <Icon name="edit-fill" color="white" size={16.64} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <MainScreenScrollView
      profileId={userId}
      type={ProfileScreenType.USER}
      profilePictureComponent={profilePictureComponent}
      middleComponent={titleAndGroupsComponent}
      profilePictureTopOffset={32}
      contentTopOffset={56}
      userGroups={userGroups}
      isOwner={isOwner}
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    gap: 4,
    alignItems: 'center',
    marginVertical: 16,
  },
  groupsContainer: {
    bottom: 8,
  },
});

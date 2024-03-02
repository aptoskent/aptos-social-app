import { View } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { useEffect, useState, useRef, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabNavigation from './HomeTabNavigation';
import {
  SCREEN_NAME_EDIT_POST,
  SCREEN_NAME_GROUP_CREATION,
  SCREEN_NAME_GROUP_INVITATION,
  SCREEN_NAME_GROUP_MEMBER_SELECTION,
  SCREEN_NAME_GROUP_SELECTION,
  SCREEN_NAME_HOME_TAB_NAV,
  SCREEN_NAME_POST,
  SCREEN_NAME_POST_LIKE_LIST,
} from './constants';
import PostScreen from '../screens/post/PostScreen';
import EditPostScreen from '../screens/edit_post/EditPostScreen';
import GroupInvitationScreen from '../screens/group_invite/GroupInvitationScreen';
import GroupCreationScreen from '../screens/group_creation/GroupCreationScreen';
import GroupSelectionScreen from '../screens/group_all/GroupSelectionScreen';
import PostLikeListScreen from '../screens/post/post_like/PostLikeListScreen';
import GroupMemberSelectionScreen from '../screens/group_member_all/GroupMemberSelectionScreen';
import GroupInviteModal from '../components/modal/GroupInviteModal';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import * as Notifications from 'expo-notifications';
import { useTypedNavigation } from '../hooks/useTypedNavigation';
import { AuthContext } from '../auth/AuthContext';
import { GLOBAL_BACKGROUND_COLOR } from '../constants';

export default function LoggedInNavigation() {
  const { graphqlClient } = useContext(AuthContext);
  const Stack = createNativeStackNavigator();
  const [groupId, setGroupId] = useState<string | null>(null);
  const navigation = useTypedNavigation();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const notificationData = response.notification.request.content.data;
        console.log(notificationData);

        if (notificationData.type == 'comment') {
          navigation.navigate(SCREEN_NAME_POST, {
            postId: notificationData.params.postId,
          });
          return;
        } else if (notificationData.type == 'post') {
          navigation.navigate(SCREEN_NAME_POST, {
            postId: notificationData.params.postId,
          });
          return;
        }
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const handleDynamicLink = async (link: any) => {
    // Handle dynamic link inside your own application
    if (link.url.startsWith('https://capthat.page.link')) {
      const invitedGroupId = link.url.split('/').pop();
      setGroupId(invitedGroupId);
    }
  };
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  const navigator = (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={SCREEN_NAME_HOME_TAB_NAV}
          component={HomeTabNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAME_POST}
          component={PostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAME_POST_LIKE_LIST}
          component={PostLikeListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAME_EDIT_POST}
          component={EditPostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAME_GROUP_INVITATION}
          component={GroupInvitationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAME_GROUP_CREATION}
          component={GroupCreationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAME_GROUP_SELECTION}
          component={GroupSelectionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAME_GROUP_MEMBER_SELECTION}
          component={GroupMemberSelectionScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      {!!groupId && <GroupInviteModal groupId={groupId} />}
    </>
  );

  return graphqlClient ? (
    <ApolloProvider client={graphqlClient}>{navigator}</ApolloProvider>
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: GLOBAL_BACKGROUND_COLOR,
        paddingHorizontal: 16,
      }}
    ></View>
  );
}

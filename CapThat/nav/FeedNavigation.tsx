import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '../screens/feed/FeedScreen';
import GroupScreen from '../screens/group/GroupScreen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import {
  SCREEN_NAME_FEED,
  SCREEN_NAME_GROUP,
  SCREEN_NAME_USER_PROFILE,
} from './constants';
import { ParamList } from './types';

export default function FeedNavigation() {
  const Stack = createNativeStackNavigator<ParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SCREEN_NAME_FEED}
        component={FeedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_USER_PROFILE}
        component={UserProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_GROUP}
        component={GroupScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

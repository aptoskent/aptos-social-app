import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import GroupScreen from '../screens/group/GroupScreen';
import MyProfileScreen from '../screens/profile/MyProfileScreen';
import {
  SCREEN_NAME_GROUP,
  SCREEN_NAME_USER_PROFILE,
  SCREEN_NAME_MY_PROFILE,
  SCREEN_NAME_ACCOUNT_SETTING,
  SCREEN_NAME_NAME_SETTING,
  SCREEN_NAME_USERNAME_SETTING,
  SCREEN_NAME_EMAIL_SETTING,
  SCREEN_NAME_BIRTHDAY_SETTING,
  SCREEN_NAME_PRONOUN_SETTING,
} from './constants';
import AccountSettingScreen from '../screens/account_setting/AccountSettingScreen';
import NameSettingScreen from '../screens/account_setting/NameSettingScreen';
import UsernameSettingScreen from '../screens/account_setting/UsernameSettingScreen';
import EmailSettingScreen from '../screens/account_setting/EmailSettingScreen';
import BirthdaySettingScreen from '../screens/account_setting/BirthdaySettingScreen';
import PronounSettingScreen from '../screens/account_setting/PronounSettingScreen';
import { ParamList } from './types';

export default function MyProfileNavigation() {
  const Stack = createNativeStackNavigator<ParamList>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SCREEN_NAME_MY_PROFILE}
        component={MyProfileScreen}
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
      <Stack.Screen
        name={SCREEN_NAME_ACCOUNT_SETTING}
        component={AccountSettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_NAME_SETTING}
        component={NameSettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_USERNAME_SETTING}
        component={UsernameSettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_EMAIL_SETTING}
        component={EmailSettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_BIRTHDAY_SETTING}
        component={BirthdaySettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_PRONOUN_SETTING}
        component={PronounSettingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

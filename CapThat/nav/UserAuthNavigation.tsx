import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegistrationScreen from '../screens/auth/RegistrationScreen';
import VerifyingScreen from '../screens/auth/VerifyingScreen';
import DOBScreen from '../screens/auth/DOBScreen';
import PronounScreen from '../screens/auth/PronounScreen';
import FullNameScreen from '../screens/auth/FullNameScreen';
import UsernameScreen from '../screens/auth/UsernameScreen';
import LaunchScreen from '../screens/auth/LaunchScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import EmailScreen from '../screens/auth/EmailScreen';
import NotificationPermissionScreen from '../screens/auth/NotificationPermissionScreen';
import InviteCodeScreen from '../screens/auth/InviteCodeScreen';

import {
  SCREEN_NAME_DOB,
  SCREEN_NAME_FULLNAME,
  SCREEN_NAME_USERNAME,
  SCREEN_NAME_PRONOUN,
  SCREEN_NAME_REGISTRATION,
  SCREEN_NAME_VERIFYING,
  SCREEN_NAME_LAUNCH,
  SCREEN_NAME_INVITE_CODE,
  SCREEN_NAME_EMAIL,
  SCREEN_NAME_NOTIFICATION_PERMISSION,
  SCREEN_NAME_SPLASH,
} from './constants';

export default function UserAuthNavigation() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={SCREEN_NAME_SPLASH}
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_LAUNCH}
        component={LaunchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_REGISTRATION}
        component={RegistrationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_VERIFYING}
        component={VerifyingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_INVITE_CODE}
        component={InviteCodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_DOB}
        component={DOBScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_PRONOUN}
        component={PronounScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_FULLNAME}
        component={FullNameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_USERNAME}
        component={UsernameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_EMAIL}
        component={EmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_NOTIFICATION_PERMISSION}
        component={NotificationPermissionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

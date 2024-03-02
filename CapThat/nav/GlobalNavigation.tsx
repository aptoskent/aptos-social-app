import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserAuthNavigation from './UserAuthNavigation';
import { useContext } from 'react';
import {
  SCREEN_NAME_LOGGED_IN_NAV,
  SCREEN_NAME_USER_AUTH_NAV,
} from './constants';
import { AuthContext } from '../auth/AuthContext';
import LoggedInNavigation from './LoggedInNavigation';

export default function GlobalNavigation() {
  const { isLoggedIn } = useContext(AuthContext);

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Screen
          name={SCREEN_NAME_LOGGED_IN_NAV}
          component={LoggedInNavigation}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name={SCREEN_NAME_USER_AUTH_NAV}
          component={UserAuthNavigation}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

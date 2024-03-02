import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-remix-icon';
import FeedNavigation from './FeedNavigation';
import MyProfileNavigation from './MyProfileNavigation';
import CreateNavigation from './CreateNavigation';
import { GLOBAL_BACKGROUND_COLOR } from '../constants';
import {
  SCREEN_NAME_CREATE_NAV,
  SCREEN_NAME_FEED_NAV,
  SCREEN_NAME_MY_PROFILE_NAV,
} from './constants';

function getIconName(routeName: string) {
  switch (routeName) {
    case SCREEN_NAME_FEED_NAV:
      return 'group-line';
    case SCREEN_NAME_CREATE_NAV:
      return 'add-circle-line';
    case SCREEN_NAME_MY_PROFILE_NAV:
      return 'user-5-line';
    default:
      return 'information-line';
  }
}

function getIconNameFocused(routeName: string) {
  switch (routeName) {
    case SCREEN_NAME_FEED_NAV:
      return 'group-fill';
    case SCREEN_NAME_CREATE_NAV:
      return 'add-circle-fill';
    case SCREEN_NAME_MY_PROFILE_NAV:
      return 'user-5-fill';
    default:
      return 'information-fill';
  }
}

// TODO: move this to a better place and consolidate the reusable part in PostScreenFooter
export const footerBarStyle = {
  backgroundColor: GLOBAL_BACKGROUND_COLOR,
  shadowColor: 'black',
  shadowOffset: {
    width: 0,
    height: -20,
  },
  shadowOpacity: 0.35,
  shadowRadius: 40,
  borderTopWidth: 0,
};

export default function HomeTabNavigation() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Icon
              name={
                focused
                  ? getIconNameFocused(route.name)
                  : getIconName(route.name)
              }
              size="22"
              color={color}
            />
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: footerBarStyle,
      })}
    >
      <Tab.Screen
        name={SCREEN_NAME_MY_PROFILE_NAV}
        component={MyProfileNavigation}
        options={{
          title: 'Me',
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />
      <Tab.Screen
        name={SCREEN_NAME_CREATE_NAV}
        component={CreateNavigation}
        options={{
          title: 'Create',
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name={SCREEN_NAME_FEED_NAV}
        component={FeedNavigation}
        options={{
          title: 'Discover',
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      />
    </Tab.Navigator>
  );
}

import CameraScreen from '../screens/camera/camera/CameraScreen';
import {
  SCREEN_NAME_CAMERA,
  SCREEN_NAME_CAMERA_ROLL,
  SCREEN_NAME_PREVIEW_POST,
} from './constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraRollScreen from '../screens/camera/camera_roll/CameraRollScreen';
import PreviewPostScreen from '../screens/camera/preview/PreviewPostScreen';
import { useEffect } from 'react';
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from '@react-navigation/native';
import { ActionType } from '../screens/camera/ActionType';

export default function CreateNavigation() {
  const Stack = createNativeStackNavigator();
  const route = useRoute();

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      // Clear route parameters after leaving the screen
      // @ts-ignore
      navigation.setParams({ params: { action: ActionType.CREATE_POST } });
    }
  }, [isFocused, navigation]);

  return (
    <Stack.Navigator initialRouteName={SCREEN_NAME_CAMERA}>
      <Stack.Screen
        name={SCREEN_NAME_CAMERA}
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_CAMERA_ROLL}
        component={CameraRollScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={SCREEN_NAME_PREVIEW_POST}
        component={PreviewPostScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

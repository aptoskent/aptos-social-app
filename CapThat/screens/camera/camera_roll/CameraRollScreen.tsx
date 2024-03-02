import { Camera } from 'expo-camera';
import { usePermissions as useMediaPermission } from 'expo-media-library';
import { View } from 'react-native';
import CameraRollScreenView from './CameraRollScreenView';
import CameraPermissionsView from '../permission/CameraPermissionsView';
import { useTypedNavigation } from '../../../hooks/useTypedNavigation';

// TODO: add TS types https://reactnavigation.org/docs/typescript/
type CameraRollScreenProps = {
  route: any;
};
export default function CameraRollScreen({ route }: CameraRollScreenProps) {
  const navigation = useTypedNavigation();
  const [cameraPermission, cameraRequestPermission] =
    Camera.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = useMediaPermission();

  // TODO: revisit
  // I kinda think this permission check is not needed yet
  // because if not permitted the user won't in be this page

  // Camera permissions are still loading
  if (!cameraPermission || !mediaPermission) {
    return <View />;
  }

  if (!mediaPermission.granted || mediaPermission.accessPrivileges !== 'all') {
    return (
      <CameraPermissionsView
        cameraGranted={cameraPermission && cameraPermission.granted}
        mediaGranted={mediaPermission && mediaPermission.granted}
        cameraRequestPermission={cameraRequestPermission}
        requestMediaPermission={requestMediaPermission}
        actionType={route.params?.actionType}
      />
    );
  }

  return <CameraRollScreenView route={route} />;
}

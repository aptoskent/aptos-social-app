import { Camera } from 'expo-camera';
import { usePermissions as useMediaPermission } from 'expo-media-library';
import { View } from 'react-native';
import CameraScreenView from './CameraScreenView';
import CameraPermissionsView from '../permission/CameraPermissionsView';

type CameraScreenProps = {
  navigation: any;
  route: any;
};

export default function CameraScreen({ navigation, route }: CameraScreenProps) {
  const [cameraPermission, cameraRequestPermission] =
    Camera.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = useMediaPermission();

  // Camera permissions are still loading
  if (!cameraPermission || !mediaPermission) {
    return <View />;
  }

  // Camera permissions are not granted yet
  if (!cameraPermission.granted || !mediaPermission.granted) {
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

  return <CameraScreenView route={route} />;
}

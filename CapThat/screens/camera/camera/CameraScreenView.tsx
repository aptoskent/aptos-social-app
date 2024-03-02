import { AutoFocus, Camera, CameraType, FlashMode } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Dimensions } from 'react-native';
import { GLOBAL_BACKGROUND_COLOR } from '../../../constants';
import CameraScreenHeader from './CameraScreenHeader';
import CameraScreenFooter from './CameraScreenFooter';
import CameraScreenFunction from './CameraScreenFunction';
import { getCameraRatio } from '../ratio';

type CameraScreenViewProps = {
  route: any;
};

export default function CameraScreenView({ route }: CameraScreenViewProps) {
  const cameraRef = useRef<Camera>(null);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.auto);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const actionType = route.params?.actionType;
  const groupId = route.params?.groupId;

  const { width } = Dimensions.get('window');
  const cameraHeight = width / getCameraRatio(actionType);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const onChangeCameraType = (updateCameraType: CameraType) => {
    setType(updateCameraType);
  };

  const onChangeCameraFlashMode = (updateFlashMode: FlashMode) => {
    setFlashMode(updateFlashMode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraScreenHeader />
      <View style={styles.cameraContainer}>
        <Camera
          style={[styles.camera, { height: cameraHeight }]}
          type={type}
          flashMode={flashMode}
          ref={cameraRef}
          onCameraReady={onCameraReady}
          autoFocus={AutoFocus.on}
        >
          <CameraScreenFunction
            isCameraReady={isCameraReady}
            cameraRef={cameraRef}
            cameraType={type}
            flashMode={flashMode}
            onChangeCameraType={onChangeCameraType}
            onChangeCameraFlashMode={onChangeCameraFlashMode}
            action={actionType}
            groupId={groupId}
          />
        </Camera>
      </View>
      <CameraScreenFooter action={actionType} groupId={groupId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    borderRadius: 12,
  },
});

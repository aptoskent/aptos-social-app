import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-remix-icon';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { TEXT_COLOR_PRIMARY } from '../../../components/text/constants';
import { ActionType } from '../ActionType';
import { goToPreview } from '../preview/goToPreview';
import TouchableButton from '../../../components/button/TouchableButton';
import { useTypedNavigation } from '../../../hooks/useTypedNavigation';

const SHOOT_BUTTON_SIZE = 80;
const SHOOT_BUTTON_INNER_SIZE = 56;

function CameraShootButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.shootButton}>
        <View style={styles.shootButtonInner} />
      </View>
    </TouchableOpacity>
  );
}

function CameraFlashModeButton({
  flashMode,
  onPress,
}: {
  flashMode: FlashMode;
  onPress: () => void;
}) {
  return (
    <TouchableButton onPress={onPress}>
      <Icon
        name={
          flashMode === FlashMode.auto ? 'flashlight-fill' : 'flashlight-line'
        }
        size={22}
        color={TEXT_COLOR_PRIMARY}
      />
    </TouchableButton>
  );
}

function CameraFrontBackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableButton onPress={onPress}>
      <Icon name="camera-switch-line" size="22" color={TEXT_COLOR_PRIMARY} />
    </TouchableButton>
  );
}

type CameraScreenFunctionProps = {
  isCameraReady: boolean;
  cameraRef: React.RefObject<Camera>;
  cameraType: CameraType;
  flashMode: FlashMode;
  onChangeCameraType: (updateCameraType: CameraType) => void;
  onChangeCameraFlashMode: (updateFlashMode: FlashMode) => void;
  action: ActionType;
  groupId?: string;
};

export default function CameraScreenFunction({
  isCameraReady,
  cameraRef,
  cameraType,
  flashMode,
  onChangeCameraType,
  onChangeCameraFlashMode,
  action,
  groupId,
}: CameraScreenFunctionProps) {
  const navigation = useTypedNavigation();
  const handleShoot = async () => {
    if (isCameraReady && cameraRef.current) {
      const options = { ratio: '3:2', base64: true };
      const photo = await cameraRef.current.takePictureAsync(options);

      goToPreview(navigation, action, photo.uri, groupId);
    }
  };

  const handleToggleCameraType = () => {
    onChangeCameraType(
      cameraType === CameraType.back ? CameraType.front : CameraType.back,
    );
  };

  // TODO: @jianyi currently we only support auto and off, add on support later
  const handleChangeFlashMode = () => {
    onChangeCameraFlashMode(
      flashMode === FlashMode.auto ? FlashMode.off : FlashMode.on,
    );
  };

  return (
    <View style={styles.container}>
      <CameraFlashModeButton
        flashMode={flashMode}
        onPress={handleChangeFlashMode}
      />
      <CameraShootButton onPress={handleShoot} />
      <CameraFrontBackButton onPress={handleToggleCameraType} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    gap: 40,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 32,
  },
  shootButton: {
    justifyContent: 'center',
    width: SHOOT_BUTTON_SIZE,
    height: SHOOT_BUTTON_SIZE,
    borderRadius: SHOOT_BUTTON_SIZE / 2,
    borderWidth: (SHOOT_BUTTON_SIZE - SHOOT_BUTTON_INNER_SIZE) / 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  shootButtonInner: {
    width: SHOOT_BUTTON_INNER_SIZE,
    height: SHOOT_BUTTON_INNER_SIZE,
    borderRadius: SHOOT_BUTTON_INNER_SIZE / 2,
    backgroundColor: TEXT_COLOR_PRIMARY,
  },
});

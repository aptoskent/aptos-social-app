import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
  SafeAreaView,
} from 'react-native';
import { GLOBAL_BACKGROUND_COLOR } from '../../../constants';
import Heading1 from '../../../components/text/Heading1';
import Icon from 'react-native-remix-icon';
import { ActionType } from '../ActionType';
import { TEXT_COLOR_SECONDARY } from '../../../components/text/constants';
import Heading4 from '../../../components/text/Heading4';
import GlobalText from '../../../components/text/GlobalText';
import { PermissionResponse } from 'expo-media-library';
import CameraScreenHeader from '../camera/CameraScreenHeader';

const CAMERA_TEXT = 'Continue to camera permissions';
const MEDIA_TEXT = 'Continue to photos permissions';

function GrantedText({ text }: { text: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <Icon
        name="checkbox-circle-line"
        size={22}
        color={TEXT_COLOR_SECONDARY}
      />
      <Heading4 inactive>{text}</Heading4>
    </View>
  );
}

function ToBeGrantedButton({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={{
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
      onPress={onPress}
    >
      <Heading4>{text}</Heading4>
    </TouchableOpacity>
  );
}

type CameraPermissionsViewProps = {
  cameraGranted: boolean;
  mediaGranted: boolean;
  cameraRequestPermission: () => Promise<PermissionResponse>;
  requestMediaPermission: () => Promise<PermissionResponse>;
  actionType: ActionType;
};

export default function CameraPermissionsView({
  cameraGranted,
  mediaGranted,
  cameraRequestPermission,
  requestMediaPermission,
  actionType,
}: CameraPermissionsViewProps) {
  const title =
    actionType === ActionType.UPLOAD_PROFILE_PHOTO
      ? 'Upload a Photo'
      : 'Post to a Group';

  const cameraRequestPermissionWithAlert = () => {
    cameraRequestPermission().then((result) => {
      if (!result.granted) {
        Alert.alert(
          'Camera permission not granted',
          'Please enable it in your settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => openAppSettings() },
          ],
        );
      }
    });
  };

  const requestMediaPermissionWithAlert = () => {
    requestMediaPermission().then((result) => {
      if (!result.granted) {
        Alert.alert(
          'Media library permission not granted',
          'Please enable it in your settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => openAppSettings() },
          ],
        );
      } else if (result.accessPrivileges !== 'all') {
        Alert.alert(
          'Media library permission limited',
          'Please enable all in your settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => openAppSettings() },
          ],
        );
      }
    });
  };

  function openAppSettings() {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraScreenHeader />
      <View style={styles.permissionContainer}>
        <View style={styles.titleContainer}>
          <Heading1>{title}</Heading1>
          <GlobalText>Grant camera and photo access to post.</GlobalText>
        </View>
        {cameraGranted ? (
          <GrantedText text={CAMERA_TEXT} />
        ) : (
          <ToBeGrantedButton
            onPress={cameraRequestPermissionWithAlert}
            text={CAMERA_TEXT}
          />
        )}
        {mediaGranted ? (
          <GrantedText text={MEDIA_TEXT} />
        ) : (
          <ToBeGrantedButton
            onPress={requestMediaPermissionWithAlert}
            text={MEDIA_TEXT}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
  titleContainer: {
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
});

import { useContext, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AuthContext } from '../../auth/AuthContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import { LogEvent, LogEventButtonName } from '../../constants';

export default function NotificationPermissionScreen() {
  const { logFirebaseEvent } = useAnalytics();
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    logFirebaseEvent(LogEvent.BUTTON, {
      button: LogEventButtonName.CONFIRM_NOTIFICATION_PERMISSION,
    });
    Notifications.requestPermissionsAsync().then(() => {
      setIsLoggedIn(true);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/notifUpsell.png')}
        style={styles.backgroundImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Adjust the image size behavior as needed
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

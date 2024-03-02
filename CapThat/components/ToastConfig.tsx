import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { View, Text, StyleSheet } from 'react-native';
import { TEXT_COLOR_PRIMARY, TEXT_COLOR_SECONDARY } from './text/constants';
import Heading2 from './text/Heading2';
import Icon from 'react-native-remix-icon';

export const toastConfig = {
  error: () => (
    <View style={styles.container}>
      <Icon name={'ri-alert-fill'} size={22} color={TEXT_COLOR_PRIMARY} />
      <Heading2>Trouble loading app right now.</Heading2>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '90%',
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FF2842',
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 6,
  },
});

import { View, ImageBackground } from 'react-native';
import { StyleSheet } from 'react-native';
import { SCREEN_NAME_REGISTRATION } from '../../nav/constants';
import PrimaryButton from '../../components/button/PrimaryButton';

// styles
import tw from '../../tailwind.js';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { LogEvent, LogEventButtonName } from '../../constants';

export default function LaunchScreen() {
  const navigation = useTypedNavigation();
  const onContinueButtonPress = () => {
    navigation.navigate(SCREEN_NAME_REGISTRATION);
  };

  return (
    <ImageBackground
      source={require('../../assets/launch.png')}
      style={styles.backgroundImage}
    >
      <View style={tw('px-4 w-full justify-end flex-1', { marginBottom: 74 })}>
        <PrimaryButton
          iconName={'ri-user-smile-fill'}
          title={'Continue with Phone Number'}
          onPress={onContinueButtonPress}
          titleStyles={{ fontFamily: 'clash-grotesk-medium' }}
          pressEventName={LogEvent.BUTTON}
          pressEventParams={{
            button: LogEventButtonName.PROCEED_PHONE,
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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

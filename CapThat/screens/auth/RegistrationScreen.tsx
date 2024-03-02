import { useState, useContext } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../../auth/AuthContext';
import { SCREEN_NAME_VERIFYING } from '../../nav/constants';
import PrimaryButton from '../../components/button/PrimaryButton';
import PrimaryTextInput from '../../components/PrimaryTextInput';
import Heading1 from '../../components/text/Heading1';

// styles
import tw from '../../tailwind';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { LogEvent, LogEventButtonName } from '../../constants';

export default function RegistrationScreen() {
  const navigation = useTypedNavigation();
  const [phoneNumber, setPhoneNumber] = useState('+1 ');

  // verification code (OTP - One-Time-Passcode)
  const { setConfirm } = useContext(AuthContext);
  const onContinueButtonPress = () => {
    auth()
      .signInWithPhoneNumber(phoneNumber)
      .then((confirmation) => {
        setConfirm(confirmation);
        navigation.navigate(SCREEN_NAME_VERIFYING, {
          phoneNumber: phoneNumber,
        });
      });
  };

  return (
    <View style={tw('flex-1 bg-background pt-30 px-4 pb-8')}>
      <KeyboardAvoidingView
        style={tw('flex-grow justify-between')}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={tw('flex-grow gap-16')}>
          <Heading1 propStyles={tw('px-12')}>
            {`What's your mobile number?`}
          </Heading1>
          <PrimaryTextInput
            title={'Mobile Number'}
            placeholder=""
            onTextChange={setPhoneNumber}
            value={phoneNumber}
            keyboardType={'phone-pad'}
            propsStyle={tw('h-20')}
          />
        </View>
        <View style={tw('pb-4')}>
          <PrimaryButton
            title={'Continue'}
            onPress={onContinueButtonPress}
            disabled={phoneNumber?.length < 4}
            pressEventName={LogEvent.BUTTON}
            pressEventParams={{
              button: LogEventButtonName.SEND_VERIFICATION,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

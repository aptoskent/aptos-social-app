import { useState, useContext, useEffect } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';

import { AuthContext } from '../../auth/AuthContext';
import {
  SCREEN_NAME_INVITE_CODE,
  SCREEN_NAME_REGISTRATION,
} from '../../nav/constants';
import PrimaryButton from '../../components/button/PrimaryButton';
import PrimaryTextInput from '../../components/PrimaryTextInput';
import Heading1 from '../../components/text/Heading1';
import GlobalText from '../../components/text/GlobalText';
import auth from '@react-native-firebase/auth';

// styles
import { finishedOnboarding } from '../../auth/utils';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import tw from '../../tailwind';
import { LogEvent, LogEventButtonName } from '../../constants';

type VerifyingScreenProps = {
  route: any;
};

export default function VerifyingScreen({ route }: VerifyingScreenProps) {
  const navigation = useTypedNavigation();
  const [passcode, setPasscode] = useState('');
  const {
    confirm,
    setIsLoggedIn,
    setAuthUser,
    handleLoginOnGraphqlClient,
    setUserId,
  } = useContext(AuthContext);
  const phoneNumber = route.params.phoneNumber;

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setAuthUser(currentUser);
      currentUser.getIdToken(true).then((token) => {
        handleLoginOnGraphqlClient(token);
        currentUser.getIdTokenResult(true).then((idTokenResult) => {
          const hasuraClaim =
            idTokenResult.claims['https://hasura.io/jwt/claims'];
          if (hasuraClaim) {
            setUserId(hasuraClaim['x-hasura-user-uuid']);
          }
        });
      });
    }
  }, []);

  const onRegisterPress = () => {
    if (passcode == null) {
      // TODO: show error message
      return;
    } else if (confirm == null) {
      // TODO: show error message
      navigation.navigate(SCREEN_NAME_REGISTRATION);
      return;
    }

    confirm
      .confirm(passcode)
      .then(() => true)
      .catch(() => {
        Alert.alert('Error', 'The passcode is invalid or has expired');
        return false;
      })
      .then((success) => {
        if (!success) {
          return;
        }
        const current_user = auth().currentUser;
        if (current_user) {
          finishedOnboarding(current_user).then((existingUser) => {
            if (!existingUser) {
              // sign up user. go on onboarding flow
              navigation.navigate(SCREEN_NAME_INVITE_CODE);
            } else {
              // log in user. go to home screen
              setIsLoggedIn(true);
            }
          });
        }
      });
  };

  const onVerifyingChange = (text: string) => {
    setPasscode(text);
  };

  return (
    <View style={tw('flex-1 bg-background pt-30 px-4 pb-8')}>
      <KeyboardAvoidingView
        style={tw('flex-grow justify-between')}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={tw('flex-grow gap-10')}>
          <View style={tw('gap-2 justify-center items-center px-6')}>
            <Heading1>Enter Verification Code</Heading1>
            <GlobalText>Enter the code we sent to {phoneNumber}.</GlobalText>
          </View>
          <PrimaryTextInput
            title={'Code'}
            placeholder={''}
            onTextChange={onVerifyingChange}
            value={passcode}
            keyboardType={'number-pad'}
            propsStyle={tw('h-20')}
          />
        </View>
        <View style={tw('pb-4')}>
          <PrimaryButton
            title={'Continue'}
            onPress={onRegisterPress}
            disabled={!passcode?.length}
            pressEventName={LogEvent.BUTTON}
            pressEventParams={{
              button: LogEventButtonName.CONFIRM_VERIFICATION,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

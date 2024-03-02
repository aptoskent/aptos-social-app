import { useState } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import PrimaryButton from '../../components/button/PrimaryButton';
import PrimaryTextInput from '../../components/PrimaryTextInput';
import Heading1 from '../../components/text/Heading1';
import GlobalText from '../../components/text/GlobalText';
import { SCREEN_NAME_DOB } from '../../nav/constants';

// styles
import tw from '../../tailwind';
import { isInviteCodeValidAndEnabled } from '../../auth/utils';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { LogEvent, LogEventButtonName } from '../../constants';

export default function InviteCodeScreen() {
  const navigation = useTypedNavigation();
  const [inviteCode, setInviteCode] = useState('');

  const onContinueButtonPress = () => {
    isInviteCodeValidAndEnabled(inviteCode.toUpperCase()).then((isValid) => {
      if (isValid) {
        navigation.navigate(SCREEN_NAME_DOB, { inviteCode: inviteCode });
      } else {
        Alert.alert('Error', 'Invalid invite code');
      }
    });
  };

  return (
    <View style={tw('flex-1 bg-background pt-30 px-4 pb-8')}>
      <KeyboardAvoidingView
        style={tw('flex-grow justify-between')}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={tw('flex-grow gap-12')}>
          <View style={tw('gap-2 px-6')}>
            <Heading1>Have an invite code?</Heading1>
            <View style={tw('mt-1 items-center')}>
              <GlobalText>CapThat is currently invite-only.</GlobalText>
              <GlobalText>Please enter your code to proceed.</GlobalText>
            </View>
          </View>
          <PrimaryTextInput
            title={'Invite Code'}
            placeholder=""
            onTextChange={setInviteCode}
            value={inviteCode}
            propsStyle={tw('h-20')}
          />
        </View>
        <View style={tw('pb-4 gap-3.5')}>
          {inviteCode?.length > 0 && (
            <View style={tw('items-center', 'flex-col-reverse')}>
              <GlobalText propStyles={tw('mt-1')}>
                {`We're still working out some kinks.`}
              </GlobalText>
              <GlobalText>Thank you for being an early adopter!</GlobalText>
            </View>
          )}
          <PrimaryButton
            title={'Continue'}
            onPress={onContinueButtonPress}
            disabled={inviteCode?.length < 3}
            pressEventName={LogEvent.BUTTON}
            pressEventParams={{
              button: LogEventButtonName.CONFIRM_INVITE_CODE,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

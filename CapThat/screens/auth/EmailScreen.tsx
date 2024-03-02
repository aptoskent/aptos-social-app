import { useState, useContext } from 'react';
import { View, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { AuthContext } from '../../auth/AuthContext';
import PrimaryButton from '../../components/button/PrimaryButton';
import Heading1 from '../../components/text/Heading1';
import { updateEmailMutation } from '../../gql/updateEmailMutation';
import { SCREEN_NAME_NOTIFICATION_PERMISSION } from '../../nav/constants';
import PrimaryTextInput from '../../components/PrimaryTextInput';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

// styles
import tw from '../../tailwind.js';
import { LogEvent, LogEventButtonName } from '../../constants';

export default function EmailScreen() {
  const navigation = useTypedNavigation();
  const [email, setEmail] = useState('');
  const { authUser, graphqlClient } = useContext(AuthContext);

  const onEmailChange = (text: string) => {
    setEmail(text);
  };

  const onContinueButtonPress = () => {
    if (authUser) {
      const variables = {
        auth_id: authUser.uid,
        email: email,
      };
      // use the client directly because this screen is not wrapped in AuthProvider
      if (graphqlClient) {
        graphqlClient
          .mutate({
            mutation: updateEmailMutation,
            variables,
          })
          .then(() => {
            navigation.navigate(SCREEN_NAME_NOTIFICATION_PERMISSION);
          });
      }
    }
  };

  return (
    <View style={tw('flex-1 bg-background pt-30 px-4 pb-8')}>
      <KeyboardAvoidingView
        style={tw('flex-grow justify-between')}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={tw('flex-grow gap-23')}>
          <View style={tw('gap-2 justify-center items-center')}>
            <Heading1>{`What's your email?`}</Heading1>
            <Text style={tw('ft-global text-center')}>
              This makes it easier for you to recover your account. Your
              information will be protected.
            </Text>
          </View>
          <PrimaryTextInput
            title={'Email'}
            placeholder={''}
            onTextChange={onEmailChange}
            autoCapitalize={'none'}
            value={email}
            propsStyle={tw('h-20')}
          />
        </View>
        <View style={tw('pb-4')}>
          <PrimaryButton
            propStyles={{ marginTop: 80 }}
            title={'Continue'}
            onPress={onContinueButtonPress}
            pressEventName={LogEvent.BUTTON}
            pressEventParams={{
              button: LogEventButtonName.CONFIRM_EMAIL,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

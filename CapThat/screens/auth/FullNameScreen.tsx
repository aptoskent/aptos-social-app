import { useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { SCREEN_NAME_USERNAME } from '../../nav/constants';
import PrimaryTextInput from '../../components/PrimaryTextInput';
import PrimaryButton from '../../components/button/PrimaryButton';
import Heading1 from '../../components/text/Heading1';

// styles
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import tw from '../../tailwind';
import { LogEvent, LogEventButtonName } from '../../constants';

type FullNameScreenProps = {
  route: any;
};

export default function FullNameScreen({ route }: FullNameScreenProps) {
  const navigation = useTypedNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { userInfo } = route.params;

  const onContinueButtonPress = () => {
    userInfo.full_name = {
      first_name: firstName,
      last_name: lastName,
    };
    navigation.navigate(SCREEN_NAME_USERNAME, { userInfo });
  };
  const onFirstNameChange = (text: string) => {
    setFirstName(text);
  };

  const onLastNameChange = (text: string) => {
    setLastName(text);
  };

  return (
    <View style={tw('flex-1 bg-background pt-30 px-4 pb-8')}>
      <KeyboardAvoidingView
        style={tw('flex-grow justify-between')}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={tw('flex-grow gap-23')}>
          <Heading1>{`What's your name?`}</Heading1>
          <View style={tw('gap-1')}>
            <PrimaryTextInput
              title={'First Name'}
              placeholder={''}
              onTextChange={onFirstNameChange}
              autoCapitalize={'words'}
              value={firstName}
              propsStyle={tw('h-20')}
            />
            <PrimaryTextInput
              title={'Last Name'}
              placeholder={''}
              onTextChange={onLastNameChange}
              autoCapitalize={'words'}
              value={lastName}
              propsStyle={tw('h-20')}
            />
          </View>
        </View>
        <View style={tw('pb-4')}>
          <PrimaryButton
            title={'Continue'}
            onPress={onContinueButtonPress}
            disabled={!(firstName && lastName)}
            pressEventName={LogEvent.BUTTON}
            pressEventParams={{
              button: LogEventButtonName.CONFIRM_FULL_NAME,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

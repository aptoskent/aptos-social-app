import { useState, useContext, useEffect } from 'react';
import {
  View,
  Alert,
  Text,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../../auth/AuthContext';
import { updateUserInfoMutation } from '../../gql/updateUserInfoMutation';
import PrimaryButton from '../../components/button/PrimaryButton';
import Heading1 from '../../components/text/Heading1';
import GlobalText from '../../components/text/GlobalText';
import CreateUsername from '../../components/onboarding/CreateUsername';

// styles
import { LogEvent, LogEventButtonName } from '../../constants';
import database from '@react-native-firebase/database';
import { SCREEN_NAME_EMAIL } from '../../nav/constants';

import tw from '../../tailwind.js';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { useAnalytics } from '../../hooks/useAnalytics';

type UsernameScreenProps = {
  route: any;
};
export default function UsernameScreen({ route }: UsernameScreenProps) {
  const navigation = useTypedNavigation();
  const [validUsername, setValidUsername] = useState('');
  const { authUser, graphqlClient, setUserId } = useContext(AuthContext);
  const { logFirebaseEvent } = useAnalytics();
  const { userInfo } = route.params;

  useEffect(() => {
    if (authUser && validUsername) {
      // update firebase username
      authUser.updateProfile({ displayName: validUsername });
    }
  }, [authUser, validUsername]);

  useEffect(() => {
    if (authUser) {
      authUser.getIdTokenResult(true).then((idTokenResult) => {
        const hasuraClaim =
          idTokenResult.claims['https://hasura.io/jwt/claims'];
        if (hasuraClaim) {
          setUserId(hasuraClaim['x-hasura-user-uuid']);
        }
      });
    }
  }, [authUser]);

  const onContinueButtonPress = () => {
    if (authUser && validUsername) {
      const variables = {
        auth_id: authUser.uid,
        username: validUsername,
        birthday: userInfo.birthday,
        full_name: userInfo.full_name,
        pronoun: userInfo.pronoun,
        invite_code: userInfo.invite_code,
      };
      // use the client directly because this screen is not wrapped in AuthProvider
      if (graphqlClient) {
        logFirebaseEvent(LogEvent.COMPLETE_ONBOARDING, {
          source: 'invite_link_placeholder', // TODO: LOGGING - get invite link
          invite_code: userInfo.invite_code,
        });
        graphqlClient
          .mutate({
            mutation: updateUserInfoMutation,
            variables,
          })
          .catch((error) => {
            if (error?.message?.includes('Uniqueness')) {
              Alert.alert(
                'Username Unavailable',
                'Please select a different username.',
              );
            } else {
              Alert.alert('Unknown error', JSON.stringify(error, null, 2));
            }
          })
          .then(() => {
            const metadataRef = database().ref('userInfo/' + authUser.uid);
            return metadataRef.set({ isFinished: true });
          })
          .then(() => {
            navigation.navigate(SCREEN_NAME_EMAIL);
          });
      }
    }
  };
  const onValidUsername = (text: string) => {
    setValidUsername(text);
  };

  return (
    <View style={tw('flex-1 bg-background pt-30 px-4 pb-8')}>
      <KeyboardAvoidingView
        style={tw('flex-grow justify-between')}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={tw('flex-grow gap-23')}>
          <Heading1>Pick a username</Heading1>
          <CreateUsername onValidUsername={onValidUsername} />
        </View>
        <View style={tw('gap-4 pb-4')}>
          <GlobalText inactive>
            By tapping Sign Up & Accept you acknowledge that you have read the{' '}
            <Text
              style={tw('text-primary')}
              onPress={() => Linking.openURL('https://www.capthat.xyz/privacy')}
            >
              Privacy Policy
            </Text>{' '}
            and agree to the{' '}
            <Text
              style={tw('text-primary')}
              onPress={() => Linking.openURL('https://www.capthat.xyz/terms')}
            >
              Terms of Service
            </Text>
            .
          </GlobalText>
          <PrimaryButton
            title={'Sign Up & Accept'}
            onPress={onContinueButtonPress}
            disabled={!validUsername}
            pressEventName={LogEvent.BUTTON}
            pressEventParams={{
              button: LogEventButtonName.CONFIRM_USERNAME,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

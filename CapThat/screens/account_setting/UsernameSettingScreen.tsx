import { SafeAreaView, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AccountSettingHeader from './AccountSettingHeader';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { updateUsernameMutation } from '../../gql/updateUsernameMutation';
import { getUserByAuthIdQuery } from '../../gql/getUserByAuthIdQuery';
import auth from '@react-native-firebase/auth';
import InProgressSpinner from '../../components/InProgressSpinner';
import PrimaryButton from '../../components/button/PrimaryButton';
import GlobalText from '../../components/text/GlobalText';
import CreateUsername from '../../components/onboarding/CreateUsername';
import ErrorView from '../../components/error_state/ErrorView';
import { TypedToast } from 'CapThat/components/TypedToast';
import { ToastType } from 'CapThat/components/TypedToast';

// styles
import { styles } from './styles';
import tw from '../../tailwind.js';

type UsernameSettingScreenProps = {
  navigation: any;
  route: any;
};
export default function UsernameSettingScreen({
  navigation,
  route,
}: UsernameSettingScreenProps) {
  const username = route.params.username;
  const [newUsername, setNewUsername] = useState(username);
  const onValidUsername = (text: string) => {
    setNewUsername(text);
  };

  const user = auth().currentUser;
  if (user === null) {
    return <ErrorView error={'User is null'} />;
  }

  const [updateUsername, { loading, error }] = useMutation(
    updateUsernameMutation,
    {
      variables: {
        auth_id: user.uid,
        username: newUsername,
      },
      refetchQueries: [
        {
          query: getUserByAuthIdQuery,
          variables: {
            auth_id: user.uid,
          },
        },
      ],
    },
  );
  const handleUpdateUsername = () => {
    updateUsername()
      .then(() => navigation.goBack())
      .catch((error) => {
        if (error?.message?.includes('Uniqueness')) {
          Alert.alert(
            'Username Unavailable',
            'Please select a different username.',
          );
        } else {
          Alert.alert(
            'Error',
            `Please select a different username or try again later. ${JSON.stringify(
              error,
              null,
              2,
            )}`,
          );
        }
      });
  };

  if (loading) {
    return <InProgressSpinner inProgress={loading} />;
  }

  if (error) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  return (
    <SafeAreaView style={styles.container}>
      <AccountSettingHeader title={'Username'} />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.textContainer}>
          <GlobalText propStyles={tw('text-center')}>
            This is how your friends find and add you on CapThat.
          </GlobalText>
        </View>
        <CreateUsername onValidUsername={onValidUsername} />
        <PrimaryButton
          propStyles={tw('my-4')}
          title={'Save'}
          onPress={handleUpdateUsername}
          disabled={!newUsername}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

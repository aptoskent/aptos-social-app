import { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PrimaryTextInput from '../../components/PrimaryTextInput';
import AccountSettingHeader from './AccountSettingHeader';
import { styles } from './styles';
import auth from '@react-native-firebase/auth';
import { useMutation } from '@apollo/client';
import { getUserByAuthIdQuery } from '../../gql/getUserByAuthIdQuery';
import { updateEmailMutation } from '../../gql/updateEmailMutation';
import InProgressSpinner from '../../components/InProgressSpinner';
import PrimaryButton from '../../components/button/PrimaryButton';
import GlobalText from '../../components/text/GlobalText';
import ErrorView from '../../components/error_state/ErrorView';
import { TypedToast } from 'CapThat/components/TypedToast';
import { ToastType } from 'CapThat/components/TypedToast';

// styles
import tw from '../../tailwind.js';

type EmailSettingScreenProps = {
  navigation: any;
  route: any;
};

export default function EmailSettingScreen({
  navigation,
  route,
}: EmailSettingScreenProps) {
  const email = route.params.email;
  const [newEmail, setNewEmail] = useState(email);

  const user = auth().currentUser;
  if (user === null) {
    return <ErrorView />;
  }
  const [updateEmail, { loading, error }] = useMutation(updateEmailMutation, {
    variables: {
      auth_id: user.uid,
      email: newEmail,
    },
    refetchQueries: [
      {
        query: getUserByAuthIdQuery,
        variables: {
          auth_id: user.uid,
        },
      },
    ],
  });
  const handleUpdateEmail = () => {
    updateEmail().then(navigation.goBack());
  };

  if (loading) {
    return <InProgressSpinner inProgress={loading} />;
  }

  if (error) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  return (
    <SafeAreaView style={styles.container}>
      <AccountSettingHeader title={'Email'} />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.textContainer}>
          <GlobalText propStyles={tw('text-center')}>
            This makes it easier to recover your account, for you and your
            friends to find each other on CapThat, and more. To help keep your
            account safe, only use an email address that you own.
          </GlobalText>
        </View>
        <PrimaryTextInput
          title={'Email'}
          value={newEmail}
          placeholder={newEmail}
          onTextChange={setNewEmail}
          autoCapitalize={'none'}
        />
        <PrimaryButton
          title={'Save'}
          onPress={handleUpdateEmail}
          propStyles={tw('my-2')}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

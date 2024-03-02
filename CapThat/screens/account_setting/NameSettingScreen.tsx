import { SafeAreaView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PrimaryTextInput from '../../components/PrimaryTextInput';
import AccountSettingHeader from './AccountSettingHeader';
import { styles } from './styles';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { updateFullNameMutation } from '../../gql/updateFullNameMutation';
import { useMutation } from '@apollo/client';
import { getUserByAuthIdQuery } from '../../gql/getUserByAuthIdQuery';
import InProgressSpinner from '../../components/InProgressSpinner';
import PrimaryButton from '../../components/button/PrimaryButton';
import GlobalText from '../../components/text/GlobalText';
import Toast from 'react-native-toast-message';
import ErrorView from '../../components/error_state/ErrorView';

// styles
import tw from '../../tailwind.js';

type NameSettingScreenProps = {
  navigation: any;
  route: any;
};
export default function NameSettingScreen({
  navigation,
  route,
}: NameSettingScreenProps) {
  const firstName = route.params.firstName;
  const lastName = route.params.lastName;
  const [newFirstName, setNewFirstName] = useState(firstName);
  const [newLastName, setNewLastName] = useState(lastName);

  const user = auth().currentUser;
  if (user === null) {
    return <ErrorView />;
  }
  const fullName = {
    last_name: newLastName,
    first_name: newFirstName,
  };
  const [updateFullName, { loading, error }] = useMutation(
    updateFullNameMutation,
    {
      variables: {
        auth_id: user.uid,
        full_name: fullName,
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
  const handleUpdateFullName = () => {
    updateFullName().then(navigation.goBack());
  };

  if (loading) {
    return <InProgressSpinner inProgress={loading} />;
  }

  if (error) {
    Toast.show({ type: 'error' });
  }

  return (
    <SafeAreaView style={styles.container}>
      <AccountSettingHeader title={'Name'} />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.textContainer}>
          <GlobalText propStyles={tw('text-center')}>
            This is how you appear on CapThat so pick a name your friends know
            you by.
          </GlobalText>
        </View>
        <PrimaryTextInput
          title={'First Name'}
          placeholder={newFirstName}
          onTextChange={setNewFirstName}
          value={newFirstName}
        />
        <PrimaryTextInput
          title={'Last Name'}
          placeholder={newLastName}
          onTextChange={setNewLastName}
          value={newLastName}
        />
        <PrimaryButton
          title={'Save'}
          onPress={handleUpdateFullName}
          propStyles={tw('my-2')}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

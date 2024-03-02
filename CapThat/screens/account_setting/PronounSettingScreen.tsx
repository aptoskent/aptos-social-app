import { SafeAreaView, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AccountSettingHeader from './AccountSettingHeader';
import { styles } from './styles';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { useMutation } from '@apollo/client';
import { getUserByAuthIdQuery } from '../../gql/getUserByAuthIdQuery';
import { updatePronounMutation } from '../../gql/updatePronounMutation';
import InProgressSpinner from '../../components/InProgressSpinner';
import PrimaryButton from '../../components/button/PrimaryButton';
import GlobalText from '../../components/text/GlobalText';
import Toast from 'react-native-toast-message';

// styles
import tw from '../../tailwind.js';
import ErrorView from '../../components/error_state/ErrorView';

type PronounSettingScreenProps = {
  navigation: any;
  route: any;
};

export default function PronounSettingScreen({
  navigation,
  route,
}: PronounSettingScreenProps) {
  const pronoun = route.params.pronoun;
  const [selectedPronoun, setSelectedPronoun] = useState(pronoun);
  const user = auth().currentUser;
  if (user === null) {
    return <ErrorView />;
  }
  const [updatePronoun, { loading, error }] = useMutation(
    updatePronounMutation,
    {
      variables: {
        auth_id: user.uid,
        pronoun: selectedPronoun,
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

  const handleUpdatePronoun = () => {
    updatePronoun().then(navigation.goBack());
  };
  const onButtonPress = (text: string) => {
    setSelectedPronoun(text);
  };

  const pronouns = [
    { text: 'She/Her', onPress: () => onButtonPress('She/Her') },
    { text: 'He/Him', onPress: () => onButtonPress('He/Him') },
    { text: 'They/Them', onPress: () => onButtonPress('They/Them') },
    {
      text: 'Prefer Not to Say',
      onPress: () => onButtonPress('Prefer Not to Say'),
    },
  ];

  if (loading) {
    return <InProgressSpinner inProgress={loading} />;
  }

  if (error) {
    Toast.show({ type: 'error' });
  }

  return (
    <SafeAreaView style={styles.container}>
      <AccountSettingHeader title={'Pronouns'} />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
      >
        {pronouns.map((pronoun, idx) => (
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  pronoun.text == selectedPronoun ? 'white' : 'transparent',
              },
            ]}
            key={idx}
            onPress={pronoun.onPress}
          >
            <GlobalText inactive={pronoun.text == selectedPronoun}>
              {pronoun.text}
            </GlobalText>
          </TouchableOpacity>
        ))}
        <PrimaryButton
          title={'Save'}
          onPress={handleUpdatePronoun}
          propStyles={tw('my-2')}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

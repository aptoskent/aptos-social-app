import { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import globalStyles from './styles';
import PrimaryButton from '../../components/button/PrimaryButton';
import { SCREEN_NAME_FULLNAME } from '../../nav/constants';
import Heading1 from '../../components/text/Heading1';
import GlobalText from '../../components/text/GlobalText';

// styles
import {
  GLOBAL_BACKGROUND_COLOR,
  LogEvent,
  LogEventButtonName,
} from '../../constants';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type PronounScreenProps = {
  route: any;
};

export default function PronounScreen({ route }: PronounScreenProps) {
  const navigation = useTypedNavigation();
  const [selectedPronoun, setSelectedPronoun] = useState('');
  const { userInfo } = route.params;

  const onContinueButtonPress = () => {
    userInfo.pronoun = selectedPronoun;
    navigation.navigate(SCREEN_NAME_FULLNAME, { userInfo });
  };

  const onButtonPress = (pronoun: string) => {
    setSelectedPronoun(pronoun);
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

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardShouldPersistTaps="always"
      >
        <View>
          <Heading1>What are your pronouns?</Heading1>
          <GlobalText propStyles={{ marginTop: 10, textAlign: 'center' }}>
            This information helps keep the CapThat community safe. Your
            information will be protected.
          </GlobalText>
        </View>

        <View style={globalStyles.pronounPicker}>
          {pronouns.map((pronoun, idx) => (
            <TouchableOpacity
              style={[
                globalStyles.button,
                {
                  backgroundColor:
                    pronoun.text == selectedPronoun ? 'white' : 'transparent',
                },
              ]}
              onPress={pronoun.onPress}
              key={idx}
            >
              <GlobalText inactive={pronoun.text == selectedPronoun}>
                {pronoun.text}
              </GlobalText>
            </TouchableOpacity>
          ))}
        </View>
        <PrimaryButton
          title={'Continue'}
          onPress={onContinueButtonPress}
          disabled={!selectedPronoun}
          pressEventName={LogEvent.BUTTON}
          pressEventParams={{
            button: LogEventButtonName.CONFIRM_PRONOUN,
          }}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    paddingHorizontal: 16,
  },
  scrollView: {
    paddingTop: 150,
  },
  scrollViewContent: {
    gap: 40,
  },
});

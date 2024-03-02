import { SafeAreaView, View, Text } from 'react-native';
import MainScreen from '../main_screen/MainScreen';
import Heading2 from '../text/Heading2';
import { colors } from '../../colors';
import Heading1 from '../text/Heading1';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-remix-icon';
import { TEXT_COLOR_PRIMARY } from '../text/constants';
import { GLOBAL_TEXT_COLOR_PLACEHOLDER } from '../../constants';

type ErrorViewProps = {
  error?: any;
};
export default function ErrorView({ error }: ErrorViewProps) {
  const headerColors = colors.darkGreyGradientColors;
  return (
    <MainScreen
      backgroundColorPrimary={headerColors.primary}
      backgroundColorSecondary={headerColors.secondary}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.icon}>
          <Icon
            name="ghost-fill"
            size={80}
            color={GLOBAL_TEXT_COLOR_PLACEHOLDER}
          />
        </View>
        <Heading1>Trouble loading CapThat right now.</Heading1>
        <View style={styles.subtitle}>
          <Heading2>Please check back again soon!</Heading2>
        </View>
      </SafeAreaView>
    </MainScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 40,
  },
  icon: {
    marginBottom: 16,
  },
  subtitle: {
    marginTop: 6,
  },
});

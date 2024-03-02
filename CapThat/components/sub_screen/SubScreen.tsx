import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
import SubScreenHeader from './SubScreenHeader';

type SubScreenProps = {
  children: React.ReactElement;
  pageTitle: string;
  backgroundColorPrimary: string;
  backgroundColorSecondary: string;
};
export default function SubScreen({
  children,
  pageTitle,
  backgroundColorPrimary,
  backgroundColorSecondary,
}: SubScreenProps) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <LinearGradient
        colors={[backgroundColorPrimary, backgroundColorSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <SubScreenHeader pageTitle={pageTitle} />
          <View style={styles.contentContainer}>{children}</View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    paddingHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    paddingBottom: 72,
    marginBottom: -72, // this is a hack to make the bottom of the screen not cut off
  },
});

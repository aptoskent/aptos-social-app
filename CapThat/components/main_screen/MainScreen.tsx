import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type MainScreenProps = {
  children: React.ReactElement;
  backgroundColorPrimary: string;
  backgroundColorSecondary: string;
};
export default function MainScreen({
  children,
  backgroundColorPrimary,
  backgroundColorSecondary,
}: MainScreenProps) {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" style="light" />
      <LinearGradient
        colors={[backgroundColorPrimary, backgroundColorSecondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </LinearGradient>
    </View>
  );
}

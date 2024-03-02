import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import GlobalNavigation from './nav/GlobalNavigation';
import { AuthContextProvider } from './auth/AuthContextProvider';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { View } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-toast-message';
import { toastConfig } from './components/ToastConfig';

const prefix = Linking.createURL('/');

const loadFonts = async () => {
  await Font.loadAsync({
    'clash-display-bold': require('./assets/ClashDisplay-Bold.ttf'),
    'clash-grotesk-regular': require('./assets/ClashGrotesk-Regular.ttf'),
    'clash-grotesk-medium': require('./assets/ClashGrotesk-Medium.ttf'),
    'clash-grotesk-semibold': require('./assets/ClashGrotesk-Semibold.ttf'),
  });
};

export default function App() {
  const queryClient = new QueryClient();
  const [isFontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadApp = async () => {
      await loadFonts();
      setFontLoaded(true);
    };

    loadApp();
  }, []);

  // Ensure analytics collection is enabled
  analytics().setAnalyticsCollectionEnabled(true);

  if (!isFontLoaded) {
    return <View />;
  }

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        GroupInvitationScreen: 'group',
      },
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <NavigationContainer linking={linking}>
          <GlobalNavigation />
        </NavigationContainer>
        <Toast config={toastConfig} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

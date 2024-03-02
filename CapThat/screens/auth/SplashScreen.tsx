import { ImageBackground, StyleSheet } from 'react-native';
import {
  SCREEN_NAME_LAUNCH,
  SCREEN_NAME_INVITE_CODE,
} from '../../nav/constants';
import auth from '@react-native-firebase/auth';
import { finishedOnboarding } from '../../auth/utils';
import { AuthContext } from '../../auth/AuthContext';
import { useContext, useEffect } from 'react';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

export default function SplashScreen() {
  const navigation = useTypedNavigation();
  const {
    setAuthUser,
    setUserId,
    handleLoginOnGraphqlClient,
    handleLogoutOnGraphqlClient,
    setIsLoggedIn,
  } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (authUser) => {
      try {
        // auto login
        if (authUser) {
          setAuthUser(authUser);
          const token = await authUser.getIdToken(true);
          handleLoginOnGraphqlClient(token);
          const idTokenResult = await authUser.getIdTokenResult(true);
          const hasuraClaim =
            idTokenResult.claims['https://hasura.io/jwt/claims'];
          if (hasuraClaim) {
            setUserId(hasuraClaim['x-hasura-user-uuid']);
          }
          finishedOnboarding(authUser).then((finished) => {
            if (finished) {
              // finished all the onboarding steps
              setIsLoggedIn(true);
            } else {
              // not finished onboarding
              navigation.navigate(SCREEN_NAME_INVITE_CODE);
            }
          });
        } else {
          // no existing user found
          setIsLoggedIn(false);
          handleLogoutOnGraphqlClient();
          navigation.navigate(SCREEN_NAME_LAUNCH);
        }
      } catch (error) {
        console.error('no existing user found', error);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/splash.png')}
      style={styles.backgroundImage}
    />
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Adjust the image size behavior as needed
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

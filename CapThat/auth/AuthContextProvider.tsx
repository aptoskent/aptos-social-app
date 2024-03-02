import analytics from '@react-native-firebase/analytics';
import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
} from '@apollo/client';
import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { User } from '../components/gallery/dataHelper';

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: AuthContextProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [graphqlClient, setGraphqlClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);

  useEffect(() => {
    if (userId) {
      analytics()
        .setUserId(userId)
        .catch((error) => {
          console.error('useAnalytics: setUserId error', error);
        });
    }
  }, [userId]);

  const handleLoginOnGraphqlClient = (token: string) => {
    const newClient = new ApolloClient({
      uri: 'https://aptos-social.hasura.app/v1/graphql',
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      setGraphqlClient(newClient);
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogoutOnGraphqlClient = () => {
    setGraphqlClient(null);
    // Other logout logic, such as clearing the auth token from local storage
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        setIsLoggedIn(false);
        setConfirm(null);
        setPhoneNumber('');
        setUserId('');
        setUser(null);
        setAuthUser(null);
        handleLogoutOnGraphqlClient();
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        confirm,
        phoneNumber,
        userId,
        user,
        authUser,
        graphqlClient,
        setIsLoggedIn,
        setConfirm,
        setPhoneNumber,
        setUserId,
        setUser,
        setAuthUser,
        handleLoginOnGraphqlClient,
        handleLogoutOnGraphqlClient,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

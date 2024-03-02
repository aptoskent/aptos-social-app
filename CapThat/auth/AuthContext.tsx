import { createContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { User } from '../components/gallery/dataHelper';

interface AuthContextProps {
  isLoggedIn: boolean;
  confirm: FirebaseAuthTypes.ConfirmationResult | null;
  phoneNumber: string;
  // user UUID, id column in hasura user table
  userId: string;
  // hasura user table user
  user: User | null;
  // firebase auth user
  authUser: FirebaseAuthTypes.User | null;
  graphqlClient: ApolloClient<NormalizedCacheObject> | null;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setConfirm: (confirm: FirebaseAuthTypes.ConfirmationResult | null) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setUserId: (userId: string) => void;
  setUser: (user: User | null) => void;
  setAuthUser: (authUser: FirebaseAuthTypes.User | null) => void;
  handleLoginOnGraphqlClient: (token: string) => void;
  handleLogoutOnGraphqlClient: () => void;
  handleLogout: () => void;
}

const defaultAuthState: AuthContextProps = {
  isLoggedIn: false,
  confirm: null,
  phoneNumber: '',
  userId: '',
  user: null,
  authUser: null,
  graphqlClient: null,
  setIsLoggedIn: () => {},
  setConfirm: () => {},
  setPhoneNumber: () => {},
  setUserId: () => {},
  setUser: () => {},
  setAuthUser: () => {},
  handleLoginOnGraphqlClient: () => {},
  handleLogoutOnGraphqlClient: () => {},
  handleLogout: () => {},
};
export const AuthContext = createContext<AuthContextProps>(defaultAuthState);

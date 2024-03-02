import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../constants';
import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import {
  UserProfilePictureWithFallback,
  UserPfpSize,
} from '../../components/profile_picture/UserProfilePicture';
import { AccountSettingRow } from '../../components/AccountSettingRow';
import AccountContactRow from '../../components/AccountContactRow';
import { useQuery } from '@apollo/client';
import {
  SCREEN_NAME_NAME_SETTING,
  SCREEN_NAME_USERNAME_SETTING,
  SCREEN_NAME_EMAIL_SETTING,
  SCREEN_NAME_BIRTHDAY_SETTING,
  SCREEN_NAME_PRONOUN_SETTING,
  SCREEN_NAME_CAMERA,
  SCREEN_NAME_CREATE_NAV,
} from '../../nav/constants';
import AccountSettingHeader from './AccountSettingHeader';
import { getUserQuery } from '../../gql/getUserQuery';
import Icon from 'react-native-remix-icon';

import { ActionType } from '../camera/ActionType';

// styles
import tw from '../../tailwind';

import { useMutation } from '@apollo/client';
import DeviceInfo from 'react-native-device-info';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { gql } from '../../__generated__/gql';
import ErrorView from '../../components/error_state/ErrorView';
import { TypedToast } from 'CapThat/components/TypedToast';
import { ToastType } from 'CapThat/components/TypedToast';

const deletePushTokenByUserMutation = gql(`
  mutation DeletePushTokenByUserMutation($user_id: uuid, $device_id: String) {
    delete_push_token(
      where: { user_id: { _eq: $user_id }, device_id: { _eq: $device_id } }
    ) {
      affected_rows
      returning {
        user_id
      }
    }
  }
`);

export default function AccountSettingScreen() {
  const navigation = useTypedNavigation();
  const { userId, handleLogout } = useContext(AuthContext);
  const [
    deletePushToken,
    { loading: deletePushTokenLoading, error: deletePushTokenError },
  ] = useMutation(deletePushTokenByUserMutation);

  const onButtonPress = async (text: string) => {
    if (!data) {
      console.warn('Button pressed but data is undefined');
      return;
    } else if (data.user.length < 1) {
      console.warn('Unexpected empty user list');
      return;
    }
    const user = data.user[0];
    switch (text) {
      case 'Name':
        navigation.navigate(SCREEN_NAME_NAME_SETTING, {
          firstName: user.full_name.first_name,
          lastName: user.full_name.last_name,
        });
        break;
      case 'Username':
        navigation.navigate(SCREEN_NAME_USERNAME_SETTING, {
          username: user.username,
        });
        break;
      case 'Email':
        navigation.navigate(SCREEN_NAME_EMAIL_SETTING, {
          email: user.email,
        });
        break;
      case 'Pronouns':
        navigation.navigate(SCREEN_NAME_PRONOUN_SETTING, {
          pronoun: user.pronoun,
        });
        break;
      case 'Birthday':
        navigation.navigate(SCREEN_NAME_BIRTHDAY_SETTING, {
          birthday: user.birthday,
        });
        break;
      case 'ContactEmail': {
        const email = 'support@capthat.xyz';
        const subject = encodeURIComponent('CapThat Support Request');
        const url = `mailto:${email}?subject=${subject}`;

        try {
          const isSupported = await Linking?.canOpenURL(url);
          if (isSupported) {
            await Linking.openURL(url);
          }
        } catch {
          Clipboard.setString(email);
          Alert.alert(`Copied support email to clipboard.`);
        }
        break;
      }
      case 'DeleteAccount': {
        const email = 'support@capthat.xyz';
        const subject = encodeURIComponent('Account Deletion Request');
        const url = `mailto:${email}?subject=${subject}`;

        try {
          const isSupported = await Linking?.canOpenURL(url);
          if (isSupported) {
            await Linking.openURL(url);
          }
        } catch {
          Clipboard.setString(email);
          Alert.alert(
            `Copied support email to clipboard. Please email us to delete your account.`,
          );
        }
        break;
      }
      default:
        return;
    }
  };

  const onLogoutPress = async () => {
    handleLogout();
    // remove the push token
    const deviceId = await DeviceInfo.getUniqueId();
    await deletePushToken({
      variables: {
        user_id: userId,
        device_id: deviceId,
      },
    });
    console.log('logged out');
  };

  const onChangeProfilePicture = () => {
    navigation.navigate(SCREEN_NAME_CREATE_NAV, {
      screen: SCREEN_NAME_CAMERA,
      params: { actionType: ActionType.UPLOAD_PROFILE_PHOTO },
      reset: true,
    });
  };

  if (!userId) {
    return <View />;
  }

  const { data, loading, error } = useQuery(getUserQuery, {
    variables: {
      user_id: userId,
    },
  });

  if (loading) {
    return <View />;
  }

  if (error) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  const userData = data?.user[0];

  if (!userData) {
    return <ErrorView />;
  }

  const settings = [
    {
      text: 'Name',
      icon: 'ri-user-smile-fill',
      value: userData.full_name.first_name + ' ' + userData.full_name.last_name,
      onPress: () => onButtonPress('Name'),
      noValue: false,
    },
    {
      text: 'Username',
      icon: 'ri-user-5-fill',
      value: userData.username,
      onPress: () => onButtonPress('Username'),
      noValue: false,
    },
    {
      text: 'Email',
      icon: 'ri-mail-fill',
      value: userData.email,
      onPress: () => onButtonPress('Email'),
      noValue: false,
    },
    {
      text: 'Pronouns',
      icon: 'ri-phone-fill',
      value: userData.pronoun,
      onPress: () => onButtonPress('Pronouns'),
      noValue: false,
    },
    {
      text: 'Birthday',
      icon: 'ri-cake-fill',
      value: userData.birthday,
      onPress: () => onButtonPress('Birthday'),
      noValue: false,
    },
    {
      text: 'Log Out',
      icon: 'ri-logout-box-r-fill',
      value: null,
      onPress: () => onLogoutPress(),
      noValue: true,
    },
  ];

  const contactMethods = [
    {
      text: 'Have a question or idea? Contact Us',
      icon: 'ri-mail-fill',
      onPress: () => onButtonPress('ContactEmail'),
    },
    {
      text: 'Delete Account',
      icon: 'delete-bin-fill',
      onPress: () => onButtonPress('DeleteAccount'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AccountSettingHeader title={'Account Settings'} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <TouchableOpacity
            style={styles.profilePictureContainer}
            onPress={onChangeProfilePicture}
          >
            <UserProfilePictureWithFallback
              userData={userData}
              size={UserPfpSize.LARGE}
            />
            <View
              style={tw(
                'absolute h-9 w-9 bg-text-default justify-center items-center rounded-full right--3 border-background border-2',
                { bottom: -11.2 },
              )}
            >
              <Icon name="edit-fill" color="white" size={16.64} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.settings}>
          {settings.map((setting, idx) => (
            <AccountSettingRow
              key={idx}
              iconName={setting.icon}
              label={setting.text}
              value={setting.value}
              onPress={setting.onPress}
              noValue={setting.noValue}
            />
          ))}
        </View>
        <View style={tw('border-t border-white my-4 py-4')}>
          {contactMethods.map((setting, idx) => (
            <AccountContactRow
              key={idx}
              iconName={setting.icon}
              label={setting.text}
              onPress={setting.onPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
  scrollView: {
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
  },
  profilePictureContainer: {
    top: 30,
    bottom: 30,
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 4,
    alignItems: 'center',
    bottom: 10,
  },
  settings: {
    marginTop: 50,
  },
});

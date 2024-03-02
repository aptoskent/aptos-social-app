import analytics from '@react-native-firebase/analytics';
import ProfileScreenView from './ProfileScreenView';
import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useGetUserHeaderBackgroundColors } from '../../hooks/useGetUserHeaderBackgroundColors';
import MainScreen from 'CapThat/components/main_screen/MainScreen';
import { requestPushToken } from '../../notification/sendNotification';
import { useMutation, useQuery } from '@apollo/client';
import { insertPushTokenMutation } from '../../gql/insertPushTokenMutation';
import MyProfileScreenHeader from './MyProfileScreenHeader';
import { deletePushTokenByDeviceMutation } from '../../gql/deletePushTokenMutation';
import DeviceInfo from 'react-native-device-info';
import { useFocusEffect } from '@react-navigation/native';
import { getUserQuery } from '../../gql/getUserQuery';
import { User } from '../../components/gallery/dataHelper';
import { TypedToast } from '../../components/TypedToast';
import { ToastType } from '../../components/TypedToast';

export default function MyProfileScreen() {
  const { userId, setUser } = useContext(AuthContext);
  const headerColors = useGetUserHeaderBackgroundColors(userId);
  const [insertPushToken, { loading, error }] = useMutation(
    insertPushTokenMutation,
  );
  const [isLaunch, setIsLaunch] = useState(true);

  const [
    deletePushToken,
    { loading: deletePushTokenLoading, error: deletePushTokenError },
  ] = useMutation(deletePushTokenByDeviceMutation);

  const { loading: getUserLoading, error: getUserError } = useQuery(
    getUserQuery,
    {
      variables: {
        user_id: userId,
      },
      onCompleted: (data) => {
        if (data.user.length !== 1) {
          TypedToast.show({ type: ToastType.ERROR });
          return;
        }
        const user: User = data.user[0];
        if (user !== null) {
          setUser(user);
        }

        analytics().setUserProperties({
          is_test_user: user.is_test_user ? 'true' : 'false',
        });
      },
    },
  );

  useFocusEffect(
    useCallback(() => {
      if (!isLaunch) {
        return;
      }
      setIsLaunch(false);
      const managePushToken = async () => {
        const token = await requestPushToken();
        const uniqueId = await DeviceInfo.getUniqueId();
        if (userId !== '' && token !== null) {
          // delete all the duplicate push tokens
          await deletePushToken({
            variables: {
              push_token: token,
              device_id: uniqueId,
            },
          });

          // insert the new push token
          await insertPushToken({
            variables: {
              user_id: userId,
              device_id: uniqueId,
              push_token: token,
              is_active: true,
            },
          });
        }
      };

      managePushToken();
    }, [isLaunch]), // The empty array makes sure this effect only runs once.
  );

  return (
    <MainScreen
      backgroundColorPrimary={headerColors.primary}
      backgroundColorSecondary={headerColors.secondary}
    >
      <>
        <MyProfileScreenHeader />
        <ProfileScreenView userId={userId} />
      </>
    </MainScreen>
  );
}

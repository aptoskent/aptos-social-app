import UserProfileScreenHeader from './UserProfileScreenHeader';
import ProfileScreenView from './ProfileScreenView';
import { useGetUserHeaderBackgroundColors } from '../../hooks/useGetUserHeaderBackgroundColors';
import MainScreen from '../../components/main_screen/MainScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamList } from '../../nav/types';
import { SCREEN_NAME_USER_PROFILE } from '../../nav/constants';

export default function UserProfileScreen({
  route,
}: NativeStackScreenProps<ParamList, typeof SCREEN_NAME_USER_PROFILE>) {
  const { userId, username } = route.params;
  const headerColors = useGetUserHeaderBackgroundColors(userId);

  return (
    <MainScreen
      backgroundColorPrimary={headerColors.primary}
      backgroundColorSecondary={headerColors.secondary}
    >
      <>
        <UserProfileScreenHeader userId={userId} username={username} />
        <ProfileScreenView userId={userId} />
      </>
    </MainScreen>
  );
}

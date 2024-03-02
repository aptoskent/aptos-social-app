import GroupCreationScreenView from './GroupCreationScreenView';
import SubScreen from '../../components/sub_screen/SubScreen';
import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { useGetUserHeaderBackgroundColors } from '../../hooks/useGetUserHeaderBackgroundColors';

type GroupCreationScreenProps = {
  route: any;
};
export default function GroupCreationScreen({
  route,
}: GroupCreationScreenProps) {
  const submitPost = route.params?.submitPost;
  const { userId } = useContext(AuthContext);
  const headerColors = useGetUserHeaderBackgroundColors(userId);

  return (
    <SubScreen
      pageTitle="Create Group"
      backgroundColorPrimary={headerColors.primary}
      backgroundColorSecondary={headerColors.secondary}
    >
      <GroupCreationScreenView submitPost={submitPost} />
    </SubScreen>
  );
}

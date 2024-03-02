import GroupSelectionScreenView from './GroupSelectionScreenView';
import SubScreen from '../../components/sub_screen/SubScreen';
import { useGetUserHeaderBackgroundColors } from '../../hooks/useGetUserHeaderBackgroundColors';

type GroupSelectionScreenProps = {
  route: any;
};

export default function GroupSelectionScreen({
  route,
}: GroupSelectionScreenProps) {
  const { userId, username } = route.params;
  const headerColors = useGetUserHeaderBackgroundColors(userId);

  return (
    <SubScreen
      pageTitle=""
      backgroundColorPrimary={headerColors.primary}
      backgroundColorSecondary={headerColors.secondary}
    >
      <GroupSelectionScreenView username={username} userId={userId} />
    </SubScreen>
  );
}

import GroupInvitationScreenView from './GroupInvitationScreenView';
import { Group } from '../../components/gallery/dataHelper';
import SubScreen from '../../components/sub_screen/SubScreen';
import { useGetGroupHeaderBackgroundColors } from '../../hooks/useGetGroupHeaderBackgroundColors';

type GroupInvitationScreenProps = {
  route: any;
};
export default function GroupInvitationScreen({
  route,
}: GroupInvitationScreenProps) {
  const { groupData } = route.params;
  const headerColors = useGetGroupHeaderBackgroundColors(
    groupData.profile_picture_serial_number,
  );

  return (
    <SubScreen
      pageTitle="Invite Friends"
      backgroundColorPrimary={headerColors.primary}
      backgroundColorSecondary={headerColors.secondary}
    >
      <GroupInvitationScreenView groupData={groupData as Group} />
    </SubScreen>
  );
}

import GroupMemberSelectionScreenView from './GroupMemberSelectionScreenView';
import SubScreen from '../../components/sub_screen/SubScreen';

type GroupMemberSelectionScreenProps = {
  route: any;
};

export default function GroupMemberSelectionScreen({
  route,
}: GroupMemberSelectionScreenProps) {
  const { groupName, members, headerColors } = route.params;

  return (
    <SubScreen
      pageTitle=""
      backgroundColorPrimary={headerColors.primary}
      backgroundColorSecondary={headerColors.secondary}
    >
      <GroupMemberSelectionScreenView groupName={groupName} members={members} />
    </SubScreen>
  );
}

import { StyleSheet, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';
import UserProfileTouchableMedium, {
  GroupScreenUserProfilePictureMoreButton,
} from '../../components/profile_picture/UserProfileTouchableMedium';
import { BackgroundColors } from '../../hooks/useGetGroupHeaderBackgroundColors';
import { GetGroupQueryQuery } from '../../__generated__/graphql';

const MAX_NUM_OF_ITEMS = 5;

type Member = GetGroupQueryQuery['group'][0]['group_user_edges'][0]['user'];

function getMembersDataShown(members: Member[]) {
  const numOfMembers = members.length;
  if (numOfMembers <= MAX_NUM_OF_ITEMS) {
    return members.slice(0, MAX_NUM_OF_ITEMS);
  } else {
    return members.slice(0, MAX_NUM_OF_ITEMS - 1);
  }
}

type GroupScreenMembersViewProps = {
  groupName: string;
  headerColors: BackgroundColors;
  members: Member[];
};

export default function GroupScreenMembersView({
  groupName,
  headerColors,
  members,
}: GroupScreenMembersViewProps) {
  const nonNullMembers = members.filter((member) => member !== null);
  const membersDataShown = getMembersDataShown(nonNullMembers);
  const numOfMembersMore = nonNullMembers.length - membersDataShown.length;

  return (
    <View style={styles.container}>
      {membersDataShown.map((memberData, idx) => {
        if (!memberData) {
          return null;
        }

        return <UserProfileTouchableMedium key={idx} userData={memberData} />;
      })}
      {numOfMembersMore > 0 && (
        <GroupScreenUserProfilePictureMoreButton
          groupName={groupName}
          headerColors={headerColors}
          numOfMembersMore={numOfMembersMore}
          members={nonNullMembers}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
});

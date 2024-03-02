import { StyleSheet, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';
import ProfileScreenGroupPicture, {
  ProfileScreenGroupPictureAddButton,
  ProfileScreenGroupPictureMoreButton,
} from './ProfileScreenGroupPicture';
import { Group } from '../../components/gallery/dataHelper';
import PrimaryButton from '../../components/button/PrimaryButton';
import { SCREEN_NAME_GROUP_CREATION } from '../../nav/constants';
import { AuthContext } from '../../auth/AuthContext';
import { useContext } from 'react';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

const MAX_NUM_OF_ITEMS = 5;

function getDisplayedData(data: Group[], numOfItems: number) {
  const numOfGroups = data.length;
  if (numOfGroups < numOfItems) {
    return data;
  } else {
    return data.slice(0, numOfItems - 1);
  }
}

type ProfileScreenGroupsViewProps = {
  profileId: string;
  username: string;
  groups: Group[];
};

export default function ProfileScreenGroupsView({
  profileId,
  username,
  groups,
}: ProfileScreenGroupsViewProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);
  const isOwnProfile = profileId === userId;

  const goToCreateGroupScreen = () => {
    navigation.navigate(SCREEN_NAME_GROUP_CREATION, {});
  };

  if (isOwnProfile && groups.length === 0) {
    return (
      <View style={styles.container}>
        <PrimaryButton
          title="Create New Group"
          onPress={goToCreateGroupScreen}
          iconName="add-circle-line"
        />
      </View>
    );
  }

  const groupDataShown = getDisplayedData(groups, MAX_NUM_OF_ITEMS);
  const numOfGroupsMore = groups.length - groupDataShown.length;
  const moreButton =
    numOfGroupsMore > 0 ? (
      <ProfileScreenGroupPictureMoreButton
        numOfGroupsMore={numOfGroupsMore}
        userId={profileId}
        username={username}
      />
    ) : (
      <ProfileScreenGroupPictureAddButton />
    );

  return (
    <View style={styles.container}>
      {groupDataShown.map((group, idx) => {
        return <ProfileScreenGroupPicture key={idx} groupData={group} />;
      })}
      {isOwnProfile ? moreButton : null}
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

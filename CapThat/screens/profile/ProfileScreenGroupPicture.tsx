import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SupportingText from '../../components/text/SupportingText';
import HexagonImage, {
  HexagonImageType,
  LISTVIEW_SIZE,
  SECONDARY_SIZE,
} from '../../components/profile_picture_mascot/HexagonImage';
import { Image } from 'react-native';
//@ts-ignore
import settingIconImage from '../../assets/setting-line-icon-white.png';
//@ts-ignore
import addIconImage from '../../assets/add-line-white-icon.png';
import {
  SCREEN_NAME_GROUP,
  SCREEN_NAME_GROUP_CREATION,
  SCREEN_NAME_GROUP_SELECTION,
} from '../../nav/constants';
import Icon from 'react-native-remix-icon';
import GroupMascot from '../../components/profile_picture_mascot/GroupMascot';
import { Group } from '../../components/gallery/dataHelper';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

function getGroupNameShown(name: string) {
  const MAX_LENGTH_OF_NAME = 10;
  const length = name.length;
  if (length <= MAX_LENGTH_OF_NAME) {
    return name;
  } else {
    return name.slice(0, MAX_LENGTH_OF_NAME - 3) + '...';
  }
}

// TODO: (zihan) this file needs some serious cleanup
// TODO: unify with GroupSelectionScreenGroupPicture and clean up the code
export default function ProfileScreenGroupPicture({
  groupData,
}: GroupProfilePictureProps) {
  const navigation = useTypedNavigation();
  const goToGroupScreen = () => {
    navigation.navigate(SCREEN_NAME_GROUP, { groupId: groupData.id });
  };

  const displayName = getGroupNameShown(groupData.name);
  const isPrivate = groupData.is_private;

  return (
    <TouchableOpacity style={styles.container} onPress={goToGroupScreen}>
      <GroupMascot
        isTestGroup={groupData.is_test_group}
        type={HexagonImageType.SECONDARY}
        groupPfpSerialNumber={groupData.profile_picture_serial_number}
        groupTestPfpSerialNumber={
          groupData.test_group_profile_picture_serial_number
        }
      />
      <View
        style={{
          flexDirection: 'row',
          gap: 4,
          alignItems: 'center',
        }}
      >
        {isPrivate && <Icon name="lock-line" size="12" color="white" />}
        <SupportingText
          singleLine
          maxWidth={isPrivate ? SECONDARY_SIZE - 20 : SECONDARY_SIZE}
        >
          {displayName}
        </SupportingText>
      </View>
    </TouchableOpacity>
  );
}

type GroupProfilePictureProps = {
  groupData: Group;
};

// TODO: unify with ProfileScreenGroupPicture and clean up the code
export function GroupSelectionScreenGroupPicture({
  groupData,
}: GroupProfilePictureProps) {
  const navigation = useTypedNavigation();
  const goToGroupScreen = () => {
    navigation.navigate(SCREEN_NAME_GROUP, { groupId: groupData.id });
  };

  const displayName = getGroupNameShown(groupData.name);
  const isPrivate = groupData.is_private;

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        gap: 6,
        width: LISTVIEW_SIZE,
        justifyContent: 'center',
      }}
      onPress={goToGroupScreen}
    >
      <GroupMascot
        isTestGroup={groupData.is_test_group}
        type={HexagonImageType.LISTVIEW}
        groupPfpSerialNumber={groupData.profile_picture_serial_number}
        groupTestPfpSerialNumber={
          groupData.test_group_profile_picture_serial_number
        }
      />
      <View
        style={{
          flexDirection: 'row',
          gap: 4,
          alignItems: 'center',
        }}
      >
        {isPrivate && <Icon name="lock-line" size={11} color="white" />}
        <SupportingText
          singleLine
          maxWidth={isPrivate ? LISTVIEW_SIZE - 20 : LISTVIEW_SIZE}
        >
          {displayName}
        </SupportingText>
      </View>
    </TouchableOpacity>
  );
}

type ProfileScreenGroupPictureMoreButtonProps = {
  numOfGroupsMore: number;
  username: string;
  userId: string;
};

export function ProfileScreenGroupPictureMoreButton({
  numOfGroupsMore,
  username,
  userId,
}: ProfileScreenGroupPictureMoreButtonProps) {
  const navigation = useTypedNavigation();
  if (!numOfGroupsMore || numOfGroupsMore === 0) {
    return null;
  }

  const goToAllGroupsScreen = () => {
    navigation.navigate(SCREEN_NAME_GROUP_SELECTION, {
      userId: userId,
      username: username,
    });
  };

  const settingIconImageUri = Image.resolveAssetSource(settingIconImage).uri;
  return (
    <TouchableOpacity style={styles.container} onPress={goToAllGroupsScreen}>
      <HexagonImage
        type={HexagonImageType.SECONDARY}
        uri={settingIconImageUri}
      />
      <SupportingText>{`${numOfGroupsMore} more`}</SupportingText>
    </TouchableOpacity>
  );
}

export function ProfileScreenGroupPictureAddButton() {
  const navigation = useTypedNavigation();
  const goToCreateGroupScreen = () => {
    navigation.navigate(SCREEN_NAME_GROUP_CREATION, {});
  };

  const addIconImageUri = Image.resolveAssetSource(addIconImage).uri;
  return (
    <TouchableOpacity style={styles.container} onPress={goToCreateGroupScreen}>
      <HexagonImage type={HexagonImageType.SECONDARY} uri={addIconImageUri} />
      <SupportingText singleLine>Add Group</SupportingText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
    width: SECONDARY_SIZE,
  },
});

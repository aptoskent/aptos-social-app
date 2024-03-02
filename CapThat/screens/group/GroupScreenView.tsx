import { StyleSheet, View } from 'react-native';
import { GLOBAL_BACKGROUND_COLOR } from '../../constants';
import Heading1 from '../../components/text/Heading1';
import Icon from 'react-native-remix-icon';
import PrimaryButton from '../../components/button/PrimaryButton';
import GroupScreenMembersView from './GroupScreenMembersView';
import SecondaryButton from '../../components/button/SecondaryButton';
import {
  SCREEN_NAME_CAMERA,
  SCREEN_NAME_CREATE_NAV,
  SCREEN_NAME_GROUP_INVITATION,
} from '../../nav/constants';
import MainScreenScrollView from '../../components/main_screen/MainScreenScrollView';
import { ActionType } from '../camera/ActionType';
import GroupMascot from '../../components/profile_picture_mascot/GroupMascot';
import { HexagonImageType } from '../../components/profile_picture_mascot/HexagonImage';
import { AuthContext } from '../../auth/AuthContext';
import { useContext, useState } from 'react';
import { useGetGroupHeaderBackgroundColors } from '../../hooks/useGetGroupHeaderBackgroundColors';
import { ProfileScreenType } from '../../components/main_screen/ProfileScreenType';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { GetGroupQueryQuery } from '../../__generated__/graphql';
import GroupInviteModal from 'CapThat/components/modal/GroupInviteModal';

type GroupScreenViewProps = {
  groupData: GetGroupQueryQuery['group'][0];
};

export default function GroupScreenView({ groupData }: GroupScreenViewProps) {
  const navigation = useTypedNavigation();
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const { userId } = useContext(AuthContext);
  const headerColors = useGetGroupHeaderBackgroundColors(
    // TODO: Ensure 0 is the proper fallback for nullable serial numbers
    groupData.is_test_group != null
      ? groupData.is_test_group
        ? groupData.test_group_profile_picture_serial_number ?? 0
        : groupData.profile_picture_serial_number ?? 0
      : 0,
  );

  const isPrivate = groupData.is_private;
  const groupName = groupData.name;
  const members = groupData.group_user_edges.map((edge) => edge.user);
  const memberIds = members.map((member) => (member ? member.id : null));
  const isMyGroup = memberIds && memberIds.includes(userId);
  const [isMyGroupOverride, setIsMyGroupOverride] = useState(isMyGroup);

  const handleCreatePost = () => {
    navigation.navigate(SCREEN_NAME_CREATE_NAV, {
      screen: SCREEN_NAME_CAMERA,
      params: {
        actionType: ActionType.CREATE_POST_FROM_GROUP,
        groupId: groupData.id,
        reset: true,
      },
    });
  };

  const handleInvite = () => {
    navigation.navigate(SCREEN_NAME_GROUP_INVITATION, { groupData: groupData });
  };

  const openRequestToJoinModal = () => {
    setShowJoinGroupModal(true);
  };

  const titleAndMembersComponent = (
    <>
      <View style={styles.titleContainer}>
        {isPrivate && <Icon name="lock-line" size={18} color="white" />}
        <Heading1>{groupName}</Heading1>
      </View>
      {isMyGroupOverride && (
        <View style={styles.buttonsContainer}>
          <PrimaryButton
            title="Create"
            iconName="add-circle-line"
            onPress={handleCreatePost}
          />
          <SecondaryButton
            title="Invite"
            iconName="user-add-line"
            onPress={handleInvite}
          />
        </View>
      )}
      {!isMyGroupOverride && !isPrivate && (
        <View style={styles.buttonsContainer}>
          <SecondaryButton
            title="Join"
            iconName="user-smile-line"
            onPress={openRequestToJoinModal}
          />
          {showJoinGroupModal ? (
            <GroupInviteModal
              groupId={groupData.id}
              setIsMyGroupOverride={setIsMyGroupOverride}
            />
          ) : null}
        </View>
      )}
      <View style={styles.membersContainer}>
        <GroupScreenMembersView
          groupName={groupData.name}
          headerColors={headerColors}
          members={members}
        />
      </View>
    </>
  );

  const profilePictureComponent = () => {
    return (
      <View style={{ paddingBottom: 50 }}>
        <GroupMascot
          isTestGroup={groupData.is_test_group}
          groupPfpSerialNumber={groupData.profile_picture_serial_number}
          groupTestPfpSerialNumber={
            groupData.test_group_profile_picture_serial_number
          }
          type={HexagonImageType.GROUP_PROFILE}
        />
      </View>
    );
  };

  return (
    <MainScreenScrollView
      profileId={groupData.id}
      type={ProfileScreenType.GROUP}
      profilePictureComponent={profilePictureComponent}
      middleComponent={titleAndMembersComponent}
      profilePictureTopOffset={52}
      contentTopOffset={96}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    bottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
    gap: 12,
    bottom: 12,
  },
  membersContainer: {
    bottom: 8,
  },
});

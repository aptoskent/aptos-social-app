import { StyleSheet, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';
import Icon from 'react-native-remix-icon';
import BottomSheetButton from '../../components/sheet/BottomSheetButton';
import { BottomSheetActionType } from '../../components/sheet/BottomSheet';
import React, { useState, useCallback, useContext } from 'react';
import LeaveGroupModal from '../../components/modal/LeaveGroupModal';
import { Group } from '../../components/gallery/dataHelper';
import GroupConfirmModal from '../../components/modal/GroupConfirmationModal';
import { GroupActionType } from './GroupActionType';
import { AuthContext } from '../../auth/AuthContext';
import TouchableButton from '../../components/button/TouchableButton';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { GetGroupQueryQuery } from '../../__generated__/graphql';

// TODO: move this to a helper file
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type GroupScreenHeaderProps = {
  groupData: GetGroupQueryQuery['group'][0];
  groupAction: GroupActionType;
};
export default function GroupScreenHeader({
  groupData,
  groupAction,
}: GroupScreenHeaderProps) {
  const navigation = useTypedNavigation();
  const [leaveGroupModalVisible, setLeaveGroupModalVisible] = useState(false);
  const isNewToGroup =
    groupAction === GroupActionType.CREATE_GROUP ||
    groupAction === GroupActionType.JOIN_GROUP;
  const [groupConfirmModalVisible, setGroupConfirmModalVisible] =
    useState(isNewToGroup);
  const { userId } = useContext(AuthContext);
  const isMyGroup = groupData.group_user_edges.some(
    (edge) => edge.user?.id === userId,
  );

  const goBack = () => {
    navigation.goBack();
  };

  const openLeaveGroupModal = () => {
    setLeaveGroupModalVisible(true);
  };

  const closeLeaveGroupModal = () => {
    setLeaveGroupModalVisible(false);
  };

  const closeGroupConfirmModal = () => {
    setGroupConfirmModalVisible(false);
  };

  const leaveGroup = useCallback(async () => {
    await delay(500);
    openLeaveGroupModal();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableButton onPress={goBack}>
        <Icon name="arrow-left-s-line" size="22" color="white" />
      </TouchableButton>
      <View style={styles.rightSide}>
        {isMyGroup && (
          <BottomSheetButton
            buttonContentComponent={
              <Icon name="more-2-fill" size="22" color="white" />
            }
            sheetTitle="Group Options..."
            sheetActions={[
              {
                name: 'Leave Group',
                iconName: 'ri-user-shared-fill',
                actionType: BottomSheetActionType.WARNING,
                actionFunction: leaveGroup,
              },
            ]}
          />
        )}
        <LeaveGroupModal
          groupData={groupData}
          isVisible={leaveGroupModalVisible}
          closeModal={closeLeaveGroupModal}
        />
        <GroupConfirmModal
          groupId={groupData.id}
          isVisible={groupConfirmModalVisible}
          closeModal={closeGroupConfirmModal}
          groupAction={groupAction}
        />
      </View>
    </View>
  );
}

// TODO: modularize styles for all headers
const styles = StyleSheet.create({
  container: {
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginTop: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightSide: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});

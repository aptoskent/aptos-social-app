import { StyleSheet, Modal, View } from 'react-native';
import PrimaryButton from '../button/PrimaryButton';
import SupportingButton from '../button/SupportingButton';
import { HexagonImageType } from '../profile_picture_mascot/HexagonImage';
import Heading1 from '../text/Heading1';
import { AuthContext } from '../../auth/AuthContext';
import { useContext } from 'react';
import { Group } from '../gallery/dataHelper';
import { useMutation } from '@apollo/client';
import {
  deleteTestUserGroupEdgedMutation,
  deleteTestUserGroupEdgedAndDeleteGroupMutation,
  deleteNonTestUserGroupEdgedMutation,
  deleteNonTestUserGroupEdgedAndDeleteGroupMutation,
} from '../../gql/deleteUserGroupEdgeMutation';
import { SCREEN_NAME_MY_PROFILE } from '../../nav/constants';
import { getMyGroupsQuery } from '../../gql/getUserGroupsQuery';
import GroupMascot from '../profile_picture_mascot/GroupMascot';
import { TEXT_COLOR_PRIMARY } from '../text/constants';
import tw from '../../tailwind.js';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { GetGroupQueryQuery } from '../../__generated__/graphql';

type GroupInviteModalProps = {
  groupData: GetGroupQueryQuery['group'][0];
  isVisible: boolean;
  closeModal: () => void;
};

export default function LeaveGroupModal({
  groupData,
  isVisible,
  closeModal,
}: GroupInviteModalProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);
  // add error and loading
  const groupSize = groupData.group_user_edges.length;
  const titleText = groupSize > 1 ? 'Leave Group?' : 'Delete Group?';
  const buttonText = groupSize > 1 ? 'Leave' : 'Delete';
  const isTestGroup = groupData.is_test_group;

  const [deleteTestGroup] = useMutation(
    groupSize > 1
      ? deleteTestUserGroupEdgedMutation
      : deleteTestUserGroupEdgedAndDeleteGroupMutation,
    {
      variables: {
        user_id: userId,
        group_id: groupData.id,
      },
      refetchQueries: [
        {
          query: getMyGroupsQuery,
          variables: {
            user_id: userId,
          },
        },
      ],
    },
  );

  const [deleteNonTestGroup] = useMutation(
    groupSize > 1
      ? deleteNonTestUserGroupEdgedMutation
      : deleteNonTestUserGroupEdgedAndDeleteGroupMutation,
    {
      variables: {
        user_id: userId,
        group_id: groupData.id,
        profile_picture_img_id: groupData.profile_image?.id,
        profile_picture_img_url: groupData.profile_image?.img_url,
        profile_picture_serial_number: groupData.profile_image?.serial_number,
        profile_picture_background_colors:
          groupData.profile_image?.background_colors,
      },
      refetchQueries: [
        {
          query: getMyGroupsQuery,
          variables: {
            user_id: userId,
          },
        },
      ],
    },
  );

  const onLeaveButton = () => {
    closeModal();

    if (isTestGroup) {
      deleteTestGroup().then(() => {
        navigation.navigate(SCREEN_NAME_MY_PROFILE);
      });
    } else {
      deleteNonTestGroup().then(() => {
        navigation.navigate(SCREEN_NAME_MY_PROFILE);
      });
    }
  };

  const onCancelButton = () => {
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <GroupMascot
            isTestGroup={groupData.is_test_group}
            type={
              groupData.is_private
                ? HexagonImageType.PRIMARY_WITH_LOCK
                : HexagonImageType.PRIMARY
            }
            groupPfpSerialNumber={groupData.profile_picture_serial_number}
            groupTestPfpSerialNumber={
              groupData.test_group_profile_picture_serial_number
            }
          />
          <View style={{ gap: 8 }}>
            <Heading1>{titleText}</Heading1>
          </View>
          <View style={styles.buttons}>
            <PrimaryButton
              propStyles={tw('w-36')}
              title={buttonText}
              onPress={onLeaveButton}
            />
            <SupportingButton
              title="Cancel"
              onPress={onCancelButton}
              textColor={TEXT_COLOR_PRIMARY}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// TODO: (zihan) generalize modal style and Modal component
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalView: {
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    width: '70%',
    backgroundColor: 'rgba(74, 68, 94, 1)',
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 4,
  },
  buttons: {
    alignItems: 'center',
    gap: 16,
  },
});

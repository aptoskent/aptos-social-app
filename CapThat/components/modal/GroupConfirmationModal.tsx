import { useEffect, useState } from 'react';
import { StyleSheet, Modal, View } from 'react-native';
import PrimaryButton from '../button/PrimaryButton';
import { HexagonImageType } from '../profile_picture_mascot/HexagonImage';
import Heading1 from '../text/Heading1';
import { getGroupQuery } from '../../gql/getGroupQuery';
import { useQuery } from '@apollo/client';
import GroupMascot from '../profile_picture_mascot/GroupMascot';
import { GroupActionType } from '../../screens/group/GroupActionType';
import Heading2 from '../text/Heading2';
import GlobalText from '../text/GlobalText';
import tw from '../../tailwind.js';

type GroupConfirmModalProps = {
  groupId: string | null;
  isVisible: boolean;
  closeModal: () => void;
  groupAction: GroupActionType;
};

export default function GroupConfirmModal({
  groupId,
  isVisible,
  closeModal,
  groupAction,
}: GroupConfirmModalProps) {
  const [modalVisible, setModalVisible] = useState(isVisible);

  const {
    data,
    loading: groupNameLoading,
    error: groupNameError,
  } = useQuery(getGroupQuery, {
    variables: {
      group_id: groupId,
    },
  });

  if (!data) {
    // TODO: Better loading state
    return null;
  } else if (data.group.length < 1) {
    console.warn('Successful query but no groups returned');
    return null;
  }

  const group = data.group[0];
  const groupName = group.name;
  const groupPfpSerialNumber = group.profile_picture_serial_number;
  const groupTestPfpSerialNumber =
    group.test_group_profile_picture_serial_number;
  const action =
    groupAction === GroupActionType.CREATE_GROUP ? 'created' : 'joined';
  const supportingText =
    groupAction === GroupActionType.CREATE_GROUP
      ? 'Each person that joins this group will get this collectible, too.'
      : 'Start sharing memories with friends.';

  const onConfirm = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ gap: 8 }}>
            <Heading1>Congrats!</Heading1>
            <Heading2
              center={true}
            >{`You've ${action} the group ${groupName} and got a collectible mascot`}</Heading2>
          </View>
          <GroupMascot
            isTestGroup={data.group[0].is_test_group}
            type={HexagonImageType.FULL}
            groupPfpSerialNumber={groupPfpSerialNumber}
            groupTestPfpSerialNumber={groupTestPfpSerialNumber}
          />
          <GlobalText propStyles={{ textAlign: 'center' }}>
            {supportingText}
          </GlobalText>
          <View style={styles.buttons}>
            <PrimaryButton
              propStyles={tw('w-36')}
              title="Cool!"
              onPress={onConfirm}
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

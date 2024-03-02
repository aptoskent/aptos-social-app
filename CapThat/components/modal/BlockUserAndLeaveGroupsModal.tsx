import { StyleSheet, Modal, View } from 'react-native';
import PrimaryButton from '../button/PrimaryButton';
import SupportingButton from '../button/SupportingButton';
import Heading1 from '../text/Heading1';
import { AuthContext } from '../../auth/AuthContext';
import { useContext, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { deleteNonTestUserGroupEdgedMutation } from '../../gql/deleteUserGroupEdgeMutation';
import { TEXT_COLOR_PRIMARY } from '../text/constants';
import { useGetSharedGroups } from '../../hooks/useGetSharedGroups';
import GlobalText from '../text/GlobalText';
import { SCREEN_NAME_MY_PROFILE } from '../../nav/constants';
import { getMyGroupsQuery } from '../../gql/getUserGroupsQuery';
import tw from '../../tailwind.js';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type BlockUserAndLeaveGroupsModalProps = {
  reportUserId: string;
  reportUsername: string;
  isVisible: boolean;
  closeModal: () => void;
};

export default function BlockUserAndLeaveGroupsModal({
  reportUserId,
  reportUsername,
  isVisible,
  closeModal,
}: BlockUserAndLeaveGroupsModalProps) {
  const navigation = useTypedNavigation();
  const { userId: myUserId } = useContext(AuthContext);
  const sharedGroups = useGetSharedGroups(myUserId, reportUserId);

  const [deleteGroup] = useMutation(deleteNonTestUserGroupEdgedMutation, {
    refetchQueries: [
      {
        query: getMyGroupsQuery,
        variables: {
          user_id: myUserId,
        },
      },
    ],
  });

  const leaveGroups = async (groupIds: string[]) => {
    for (const groupId of groupIds) {
      await deleteGroup({
        variables: {
          user_id: myUserId,
          group_id: groupId,
        },
      });
      console.log(`User ${myUserId} has left group ${groupId}`);
    }
  };

  const onLeaveButton = async () => {
    closeModal();
    leaveGroups(sharedGroups).then(() => {
      navigation.navigate(SCREEN_NAME_MY_PROFILE);
    });
  };

  const onCancelButton = () => {
    closeModal();
  };

  const count = sharedGroups?.length ?? 0;

  const groupCountText = useMemo(() => {
    switch (count) {
      case 1:
        return `the ${count} group`;
      case 0:
        return `the groups`;
      default:
        return `the ${count} groups`;
    }
  }, [count]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ gap: 8 }}>
            <Heading1>{`Block ${reportUsername}?`}</Heading1>
            <GlobalText propStyles={tw('text-center')}>
              {`If you no longer want to interact with ${reportUsername}, you can leave ${groupCountText} you share with this user. You can still view each other's profiles and see their content in the Discover Feed. `}
            </GlobalText>
            <GlobalText propStyles={tw('text-center', 'text-red-500')}>
              Please proceed with caution as this action cannot be undone.
            </GlobalText>
          </View>
          <View style={styles.buttons}>
            <PrimaryButton
              propStyles={tw('w-36')}
              title={'Leave Groups'}
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

import { StyleSheet, Modal, View } from 'react-native';
import { useMutation } from '@apollo/client';
import { Post } from '../gallery/dataHelper';
import { updatePostAsDeletedMutation } from '../../gql/updatePostMutation';
import Heading1 from '../text/Heading1';
import PrimaryButton from '../button/PrimaryButton';
import SupportingButton from '../button/SupportingButton';
import InProgressSpinner from '../InProgressSpinner';
import GlobalText from '../text/GlobalText';
import { TEXT_COLOR_PRIMARY } from '../text/constants';
import tw from '../../tailwind.js';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type PostDeleteModalProps = {
  post: Post;
  isVisible: boolean;
  closeModal: () => void;
};

export default function PostDeleteModal({
  post,
  isVisible,
  closeModal,
}: PostDeleteModalProps) {
  const navigation = useTypedNavigation();
  const [updatePostAsDeleted, { loading, error }] = useMutation(
    updatePostAsDeletedMutation,
    {
      variables: {
        post_id: post.id,
      },
    },
  );

  const onDeleteButton = async () => {
    updatePostAsDeleted().then(() => {
      closeModal();
      navigation.goBack();
    });
  };

  const onCancelButton = () => {
    closeModal();
  };

  if (error) {
    closeModal();
  }

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
            <Heading1>Delete post?</Heading1>
            <GlobalText propStyles={{ textAlign: 'center' }}>
              You won’t be able to undo this action and it will be permanently
              deleted.
            </GlobalText>
          </View>
          <View style={styles.buttons}>
            <PrimaryButton
              propStyles={tw('w-36')}
              title="Delete"
              onPress={onDeleteButton}
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

import { StyleSheet, Modal, View } from 'react-native';
import PrimaryButton from '../button/PrimaryButton';
import GlobalText from '../text/GlobalText';
import Icon from 'react-native-remix-icon';
import { TEXT_COLOR_PRIMARY } from '../text/constants';
import tw from '../../tailwind.js';

type Props = {
  closeModal: () => void;
};

export default function ValidationModal({ closeModal }: Props) {
  const onCancelButton = () => {
    closeModal();
  };

  return (
    <Modal animationType="fade" transparent onRequestClose={onCancelButton}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ gap: 16, alignItems: 'center' }}>
            <Icon name="cake-2-line" size={64} color={TEXT_COLOR_PRIMARY} />
            <GlobalText propStyles={{ textAlign: 'center' }}>
              Sorry, it looks like you're not eligible for CapThat, but thanks
              for checking us out!
            </GlobalText>
          </View>
          <View style={styles.buttons}>
            <PrimaryButton
              propStyles={tw('w-36')}
              title="Got it"
              onPress={onCancelButton}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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

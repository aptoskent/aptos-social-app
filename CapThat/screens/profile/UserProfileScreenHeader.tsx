import { StyleSheet, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';
import Icon from 'react-native-remix-icon';
import TouchableButton from '../../components/button/TouchableButton';
import BottomSheetButton from '../../components/sheet/BottomSheetButton';
import { BottomSheetActionType } from '../../components/sheet/BottomSheet';
import { useCallback, useState } from 'react';
import BlockUserAndLeaveGroupsModal from '../../components/modal/BlockUserAndLeaveGroupsModal';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

// TODO: move this to a helper file
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type ProfileScreenHeaderProps = {
  userId: string;
  username: string;
};
export default function ProfileScreenHeader({
  userId,
  username,
}: ProfileScreenHeaderProps) {
  const navigation = useTypedNavigation();
  const [leaveGroupsModalVisible, setLeaveGroupsModalVisible] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const reportUser = useCallback(async () => {
    await delay(500);
    openLeaveGroupsModal();
  }, []);

  const openLeaveGroupsModal = () => {
    setLeaveGroupsModalVisible(true);
  };

  const closeLeaveGroupsModal = () => {
    setLeaveGroupsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableButton onPress={goBack}>
        <Icon name="arrow-left-s-line" size="22" color="white" />
      </TouchableButton>

      <BottomSheetButton
        buttonContentComponent={
          <Icon name="more-2-fill" size="22" color="white" />
        }
        sheetTitle=""
        sheetActions={[
          {
            name: `Block ${username ?? ''}`,
            iconName: 'ri-user-shared-fill',
            actionType: BottomSheetActionType.WARNING,
            actionFunction: reportUser,
          },
        ]}
      />
      <BlockUserAndLeaveGroupsModal
        reportUserId={userId}
        reportUsername={username}
        isVisible={leaveGroupsModalVisible}
        closeModal={closeLeaveGroupsModal}
      />
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
});

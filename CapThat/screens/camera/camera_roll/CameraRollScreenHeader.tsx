import { StyleSheet, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../../constants';
import Icon from 'react-native-remix-icon';
import { ActionType } from '../ActionType';
import Heading4 from '../../../components/text/Heading4';
import { goToPreview } from '../preview/goToPreview';
import TouchableButton from '../../../components/button/TouchableButton';
import { useTypedNavigation } from '../../../hooks/useTypedNavigation';

type CameraRollScreenHeaderProps = {
  imageUri: string;
  action: ActionType;
  groupId?: string;
};

export default function CameraRollScreenHeader({
  imageUri,
  action,
  groupId,
}: CameraRollScreenHeaderProps) {
  const navigation = useTypedNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    goToPreview(navigation, action, imageUri, groupId);
  };

  return (
    <View style={styles.container}>
      <TouchableButton onPress={handleGoBack}>
        <Icon name="arrow-left-s-line" size="22" color="white" />
      </TouchableButton>
      <TouchableButton onPress={handleNext}>
        <Heading4>Next</Heading4>
      </TouchableButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

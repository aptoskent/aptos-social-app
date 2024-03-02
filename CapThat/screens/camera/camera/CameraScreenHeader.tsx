import { StyleSheet, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../../constants';
import Icon from 'react-native-remix-icon';
import TouchableButton from '../../../components/button/TouchableButton';
import { useTypedNavigation } from '../../../hooks/useTypedNavigation';

export default function CameraScreenHeader() {
  const navigation = useTypedNavigation();
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableButton onPress={handleGoBack}>
        <Icon name="arrow-left-s-line" size="22" color="white" />
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
  },
});

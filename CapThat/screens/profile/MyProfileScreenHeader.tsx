import { StyleSheet, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';
import Icon from 'react-native-remix-icon';
import { SCREEN_NAME_ACCOUNT_SETTING } from '../../nav/constants';
import TouchableButton from '../../components/button/TouchableButton';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

// TODO: move this to a helper file
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type ProfileScreenHeaderProps = {};
export default function MyProfileScreenHeader({}: ProfileScreenHeaderProps) {
  const navigation = useTypedNavigation();
  const goToSettings = () => {
    navigation.navigate(SCREEN_NAME_ACCOUNT_SETTING);
  };

  return (
    <View style={styles.container}>
      <View />
      <TouchableButton onPress={goToSettings}>
        <Icon name="menu-5-line" size="22" color="white" />
      </TouchableButton>
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

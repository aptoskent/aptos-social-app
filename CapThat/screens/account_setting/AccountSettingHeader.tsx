import { StatusBar } from 'expo-status-bar';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';
import Icon from 'react-native-remix-icon';
import Heading2 from '../../components/text/Heading2';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type UserProfilePictureAddButtonProps = {
  title: string;
};
export default function AccountSettingHeader({
  title,
}: UserProfilePictureAddButtonProps) {
  const navigation = useTypedNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="arrow-left-s-line" size="22" color="white" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Heading2>{title}</Heading2>
        </View>
        <TouchableOpacity />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginTop: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    flexDirection: 'row',
  },
});

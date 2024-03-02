import { StyleSheet, View, SafeAreaView } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../../constants';
import Icon from 'react-native-remix-icon';
import Heading2 from '../../../components/text/Heading2';
import TouchableButton from '../../../components/button/TouchableButton';
import { useTypedNavigation } from '../../../hooks/useTypedNavigation';

type PostLikeListScreenHeaderProps = {};
export default function PostLikeListScreenHeader({}: PostLikeListScreenHeaderProps) {
  const navigation = useTypedNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableButton onPress={goBack}>
        <Icon name="arrow-left-s-line" size="22" color="white" />
      </TouchableButton>
      <View style={styles.titleContainer}>
        <Heading2>Liked By</Heading2>
      </View>
    </SafeAreaView>
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
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

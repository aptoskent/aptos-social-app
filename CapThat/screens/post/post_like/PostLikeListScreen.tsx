import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import PostLikeListScreenHeader from './PostLikeListHeader';
import PostLikeListScreenView from './PostLikeListView';
import { GLOBAL_BACKGROUND_COLOR } from '../../../constants';

// TODO: add TS types https://reactnavigation.org/docs/typescript/
export default function PostLikeListScreen({ navigation, route }) {
  const { postId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View>
        <PostLikeListScreenHeader />
        <PostLikeListScreenView postId={postId} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
});

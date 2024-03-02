import { StatusBar } from 'expo-status-bar';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { GLOBAL_BACKGROUND_COLOR } from '../../constants';
import EditPostScreenHeader from './EditPostScreenHeader';
import EditPostScreenFooter from './EditPostScreenFooter';
import EditPostScreenView from './EditPostScreenView';

// TODO: add TS types https://reactnavigation.org/docs/typescript/
export default function EditPostScreen({ navigation, route }) {
  const { post } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <EditPostScreenHeader />
      <EditPostScreenView image={post.photo_post.image} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={12}
        >
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <EditPostScreenFooter post={post} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
});

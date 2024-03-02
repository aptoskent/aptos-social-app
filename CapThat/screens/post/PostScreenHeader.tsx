import { StyleSheet, View, Text } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';
import Icon from 'react-native-remix-icon';
import { useCallback, useState } from 'react';
import { Post } from '../../components/gallery/dataHelper';
import { convertTimestampToUserTime } from '../../utils';
import { PostMoreOptionButton } from './PostMoreOptionButton';
import GlobalText from '../../components/text/GlobalText';
import PostDeleteModal from '../../components/modal/PostDeleteModal';
import { delay } from '../group/GroupScreenHeader';
import TouchableButton from '../../components/button/TouchableButton';
import { CustomBottomSheetButton } from '../../components/sheet/BottomSheetButton';
import UsersGalleryView from '../../components/UsersGalleryView';
// utils
import { navigateToGroupScreen } from '../../utils/navigationUtils';

// styles
import tw from '../../tailwind.js';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type PostScreenHeaderProps = {
  post: Post;
};

export default function PostScreenHeader({ post }: PostScreenHeaderProps) {
  const navigation = useTypedNavigation();
  const [postDeleteModalVisible, setPostDeleteModalVisible] = useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const goToGroupScreen = useCallback(() => {
    navigateToGroupScreen(navigation, post?.group_id);
  }, [navigation, post?.group_id]);

  const openPostDeleteModal = async () => {
    // we need this otherwise modal will not show up
    await delay(500);
    setPostDeleteModalVisible(true);
  };

  const closePostDeleteModal = () => {
    setPostDeleteModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableButton onPress={goBack}>
        <Icon name="arrow-left-s-line" size="22" color="white" />
      </TouchableButton>
      <View style={styles.titleContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {post.group.is_private && (
            <CustomBottomSheetButton
              buttonContentComponent={
                <Icon name="lock-line" size="12" color="white" />
              }
              sheetContentComponent={
                <UsersGalleryView
                  groupName={post.group.name}
                  groupId={post.group.id}
                />
              }
              exitSheet={false}
              propsStyle={{ wrapper: tw('bg-black bg-opacity-50') }}
            />
          )}
          <Text
            onPress={goToGroupScreen}
            style={tw('font-clash_bold text-white text-sm font-bold')}
          >
            {post.group.name}
          </Text>
        </View>
        <GlobalText inactive>
          {convertTimestampToUserTime(post.created_at)}
        </GlobalText>
      </View>
      <PostMoreOptionButton
        post={post}
        openPostDeleteModal={openPostDeleteModal}
      />
      <PostDeleteModal
        post={post}
        isVisible={postDeleteModalVisible}
        closeModal={closePostDeleteModal}
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
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

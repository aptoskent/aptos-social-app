import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Post } from './dataHelper';
import { SCREEN_NAME_POST } from '../../nav/constants';
import Icon from 'react-native-remix-icon';
import SupportingText from '../text/SupportingText';
import { useDownloadUrlForImage } from '../../hooks/useDownloadUrlForImage';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type GalleryViewPhotoProps = {
  post: Post;
  photoDisplayWidth: number;
  source: string;
};

export default function GalleryViewPhoto({
  post,
  photoDisplayWidth,
  source,
}: GalleryViewPhotoProps) {
  const navigation = useTypedNavigation();
  const {
    downloadUrl: thumbnailUrl,
    isLoading,
    error,
  } = useDownloadUrlForImage(post?.photo_post.image.thumbnail_url);

  if (!post) {
    return null;
  }

  const commentCount = post?.comments_aggregate?.aggregate.count || 0;

  const heightToWidthRatio =
    post.photo_post.image.metadata.height /
    post.photo_post.image.metadata.width;
  const photoDisplayHeight = photoDisplayWidth * heightToWidthRatio;

  const goToPostScreen = () => {
    navigation.navigate(SCREEN_NAME_POST, {
      postId: post.id,
      source: source,
    });
  };

  return (
    <TouchableOpacity onPress={goToPostScreen}>
      {thumbnailUrl && (
        <View style={styles.container}>
          <Image
            source={{ uri: thumbnailUrl }}
            style={{
              alignItems: 'center',
              width: photoDisplayWidth,
              height: photoDisplayHeight,
              borderRadius: 8,
              marginVertical: 4,
            }}
          />
          {commentCount > 0 && (
            <View style={styles.commentsContainer}>
              <Icon name="chat-smile-2-line" size="16" color="white" />
              <SupportingText>{commentCount}</SupportingText>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
});

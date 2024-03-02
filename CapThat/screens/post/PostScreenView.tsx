import { StyleSheet, View } from 'react-native';
import { Post } from '../../components/gallery/dataHelper';
import PostScreenCaption from './PostScreenCaption';
import PostScreenComments from './PostScreenComments';
import PostScreenImage from './PostScreenImage';
import PostScreenReactions from './PostScreenReactions';
import { ContentScrollViewContainer } from '../../components/footer_screen/ContentScrollViewContainer';

type PostScreenViewProps = {
  post: Post;
};
export default function PostScreenView({ post }: PostScreenViewProps) {
  return (
    <ContentScrollViewContainer>
      <PostScreenImage image={post.photo_post.image} />
      <View style={styles.reactionContainer}>
        <PostScreenCaption
          creatorUserData={post.photo_post.created_by_user}
          caption={post.photo_post.caption}
        />
        <PostScreenReactions post={post} />
      </View>
      <PostScreenComments postId={post.id} />
    </ContentScrollViewContainer>
  );
}

export const styles = StyleSheet.create({
  reactionContainer: {
    marginBottom: 12,
  },
});

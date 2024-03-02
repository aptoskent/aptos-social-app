import { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../../auth/AuthContext';
import UserProfileTouchableSmall from '../../components/profile_picture/UserProfileTouchableSmall';
import { PostComment } from '../../components/gallery/dataHelper';
import { getCommentsByPostQuery } from '../../gql/getCommentsByPostQuery';
import { useQuery } from '@apollo/client';
import InProgressSpinner from '../../components/InProgressSpinner';
import { convertTimestampToUserTime } from '../../utils';
import GlobalText from '../../components/text/GlobalText';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import ErrorView from '../../components/error_state/ErrorView';
import tw from '../../tailwind';

// utils
import { navigateToProfilescreen } from '../../utils/navigationUtils';

type PostScreenComments = {
  postId: string;
};

// TODO: (jianyi) use graphql fragment
export default function PostScreenComments({ postId }: PostScreenComments) {
  const { userId } = useContext(AuthContext);
  const navigation = useTypedNavigation();
  const { loading, error, data } = useQuery(getCommentsByPostQuery, {
    variables: {
      post_id: postId,
    },
  });

  const goToProfileScreen = (userData) => {
    const { id, username } = userData;
    const isOwner = userData?.id === userId;

    navigateToProfilescreen(navigation, id, username, isOwner);
  };

  if (error) {
    return <ErrorView />;
  }

  if (loading) {
    return <InProgressSpinner inProgress={loading} />;
  }

  return (
    <View>
      {data &&
        data.post[0].comments.map((comment: PostComment, idx: number) => (
          <View style={styles.itemContainer} key={idx}>
            <View style={styles.pfpContainer}>
              <UserProfileTouchableSmall userData={comment.from_user} />
            </View>
            <View style={styles.titleAndCommentContainer}>
              <View style={styles.titleContainer}>
                <Text
                  onPress={() => goToProfileScreen(comment?.from_user)}
                  style={tw('font-clash_bold text-white text-sm font-bold')}
                >
                  {comment?.from_user?.username}
                </Text>
                <GlobalText inactive>
                  {convertTimestampToUserTime(comment.created_at)}
                </GlobalText>
              </View>
              <GlobalText>{comment.content}</GlobalText>
            </View>
          </View>
        ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 8,
  },
  pfpContainer: {
    marginTop: 4,
  },
  titleAndCommentContainer: {
    gap: 4,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

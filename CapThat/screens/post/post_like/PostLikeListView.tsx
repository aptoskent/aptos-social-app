import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  TouchableOpacity,
} from 'react-native';
import { PostReaction } from '../../../components/gallery/dataHelper';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../../constants';
import { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { getReactionsByPostQuery } from '../../../gql/getReactionsByPostQuery';
import InProgressSpinner from '../../../components/InProgressSpinner';
import {
  SCREEN_NAME_MY_PROFILE,
  SCREEN_NAME_USER_PROFILE,
} from '../../../nav/constants';
import { convertTimestampToUserTime } from '../../../utils';
import Heading2 from '../../../components/text/Heading2';
import GlobalText from '../../../components/text/GlobalText';
import { AuthContext } from '../../../auth/AuthContext';
import { useTypedNavigation } from '../../../hooks/useTypedNavigation';
import ErrorView from '../../../components/error_state/ErrorView';
import { TypedToast } from '../../../components/TypedToast';
import { ToastType } from '../../../components/TypedToast';

const LIMIT = 10;

type PostLikeListScreenViewProps = {
  postId: string;
};
export default function PostLikeListScreenView({
  postId,
}: PostLikeListScreenViewProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);
  const [reactions, setReactions] = useState<PostReaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error, fetchMore } = useQuery(getReactionsByPostQuery, {
    variables: {
      post_id: postId,
      offset: 0,
      limit: LIMIT,
    },
    onCompleted: (result) => {
      if (result.post.length === 0) {
        TypedToast.show({ type: ToastType.ERROR });
      }
      setReactions(result.post[0].reactions);
    },
  });

  if (loading) {
    return <InProgressSpinner inProgress={loading} />;
  }

  if (error) {
    return <ErrorView />;
  }

  const fetchData = async () => {
    await fetchMore({
      variables: { offset: reactions.length, limit: LIMIT },
      updateQuery: (_, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return;
        }
        setReactions([...reactions, ...fetchMoreResult.post[0].reactions]);
      },
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMore({
      variables: { offset: 0, limit: LIMIT },
    })
      .then((refreshedData) => {
        if (refreshedData && refreshedData.data) {
          setReactions(refreshedData.data.post[0].reactions);
        }
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onScroll={(event) => {
        const { layoutMeasurement, contentOffset, contentSize } =
          event.nativeEvent;
        const isEndReached =
          layoutMeasurement.height + contentOffset.y >= contentSize.height;
        if (isEndReached) {
          fetchData();
        }
      }}
      scrollEventThrottle={2}
      showsVerticalScrollIndicator={false}
    >
      {reactions.map((reaction, index) => (
        <View
          key={reaction?.id ?? index}
          style={styles.titleAndCommentContainer}
        >
          <TouchableOpacity
            onPress={() => {
              if (userId === reaction.from_user.id) {
                navigation.navigate(SCREEN_NAME_MY_PROFILE);
              } else {
                navigation.navigate(SCREEN_NAME_USER_PROFILE, {
                  userId: reaction.from_user.id,
                  username: reaction.from_user.username,
                });
              }
            }}
          >
            <View style={styles.titleContainer}>
              <Heading2>{reaction.from_user.username}</Heading2>
              <GlobalText inactive>
                {convertTimestampToUserTime(reaction.created_at)}
              </GlobalText>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginBottom: 65, // this is a hack to make the bottom of the screen not cut off
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

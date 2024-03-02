import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  View,
} from 'react-native';
import { GLOBAL_BACKGROUND_COLOR } from '../../constants';
import FeedScreenWidget from 'CapThat/screens/feed/FeedScreenWidget';
import { useQuery } from '@apollo/client';
import { Post } from '../../components/gallery/dataHelper';
import InProgressSpinner from '../../components/InProgressSpinner';
import { useContext, useState } from 'react';
import Heading1 from '../../components/text/Heading1';
import { AuthContext } from '../../auth/AuthContext';
import {
  getPostsFromPublicGroupsWithTestGroupsQuery,
  getPostsFromPublicGroupsWithoutTestGroupsQuery,
} from '../../gql/getPostsFromPublicGroupsQuery';
import { TypedToast } from 'CapThat/components/TypedToast';
import { ToastType } from 'CapThat/components/TypedToast';

const LIMIT = 3;

// TODO: add TS types https://reactnavigation.org/docs/typescript/
export default function FeedScreen() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, error, fetchMore } = useQuery(
    user?.is_test_user
      ? getPostsFromPublicGroupsWithTestGroupsQuery
      : getPostsFromPublicGroupsWithoutTestGroupsQuery,
    {
      variables: {
        offset: 0,
        limit: LIMIT,
      },
      onCompleted: (result) => {
        setPosts(result.post);
      },
    },
  );

  const fetchData = async () => {
    await fetchMore({
      variables: { offset: posts.length, limit: LIMIT },
      updateQuery: (_, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return;
        }
        setPosts([...posts, ...fetchMoreResult.post]);
      },
    });
  };

  if (error) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchMore({
      variables: { offset: 0, limit: LIMIT },
    })
      .then((refreshedData) => {
        if (refreshedData && refreshedData.data) {
          setPosts(refreshedData.data.post);
        }
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {loading || refreshing ? (
        <InProgressSpinner inProgress={loading || refreshing} />
      ) : (
        <ScrollView
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
          scrollEventThrottle={2} // Adjust this value for smoother scrolling
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headingContainer}>
            <Heading1>CapThat</Heading1>
          </View>
          {posts.map((post: Post, index: number) => {
            return <FeedScreenWidget key={index} post={post} />;
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
  headingContainer: {
    marginVertical: 4,
  },
});

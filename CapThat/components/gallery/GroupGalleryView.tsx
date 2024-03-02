import { Post } from './dataHelper';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { getGroupPostsQuery } from '../../gql/getGroupPostsQuery';
import { View } from 'react-native';
import MasonryGalleryView from './MasonryGalleryView';
import EmptyStateView from './EmptyStateView';
import { ProfileScreenType } from '../main_screen/ProfileScreenType';

const LIMIT = 12;

type GroupGalleryViewProps = {
  groupId: string;
  isEndReached: boolean;
  isRefreshing: boolean;
};

export default function GroupGalleryView({
  groupId,
  isEndReached,
  isRefreshing,
}: GroupGalleryViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { loading, error, data, fetchMore } = useQuery(getGroupPostsQuery, {
    variables: {
      group_id: groupId,
      offset: 0,
      limit: LIMIT,
    },
  });

  useEffect(() => {
    if (isEndReached) {
      fetchData();
    }
    if (isRefreshing) {
      refreshData();
    }
  }, [isEndReached, isRefreshing]);

  useEffect(() => {
    if (!data) {
      return;
    }
    setPosts(data.group[0].posts);
  }, [data]);

  const fetchData = async () => {
    await fetchMore({
      variables: { offset: posts.length, limit: LIMIT },
      updateQuery: (_, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return;
        }
        setPosts([...posts, ...fetchMoreResult.group[0].posts]);
      },
    });
  };

  const refreshData = async () => {
    await fetchMore({
      variables: { offset: 0, limit: LIMIT },
      updateQuery: (_, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return;
        }
        setPosts(fetchMoreResult.group[0].posts);
      },
    });
  };

  if (error) {
    return <View />;
  }

  if (loading) {
    return <View />;
  }

  return posts.length > 0 ? (
    <MasonryGalleryView posts={posts} source={'group'} />
  ) : (
    <EmptyStateView type={ProfileScreenType.GROUP} />
  );
}

import { Group, Post } from './dataHelper';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { View } from 'react-native';
import MasonryGalleryView from './MasonryGalleryView';
import { getMyGroupPostsQuery } from '../../gql/getMyGroupPostsQuery';
import EmptyStateView from './EmptyStateView';
import { ProfileScreenType } from '../main_screen/ProfileScreenType';

const LIMIT = 12;

type UserGalleryViewProps = {
  isEndReached: boolean;
  isRefreshing: boolean;
  userGroups: Group[];
  isOwner: boolean;
};

export default function UserGalleryView({
  isEndReached,
  isRefreshing,
  userGroups,
  isOwner,
}: UserGalleryViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { loading, error, fetchMore } = useQuery(getMyGroupPostsQuery, {
    variables: {
      offset: 0,
      limit: LIMIT,
      my_group_ids: userGroups.map((group) => group.id),
    },
    onCompleted: (data) => {
      setPosts(data.post);
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

  const refreshData = async () => {
    await fetchMore({
      variables: { offset: 0, limit: LIMIT },
      updateQuery: (_, { fetchMoreResult }) => {
        setPosts(fetchMoreResult.post);
      },
    });
  };

  if (error) {
    return <EmptyStateView type={ProfileScreenType.USER} />;
  }

  if (loading) {
    return <View />;
  }

  return posts.length > 0 ? (
    <MasonryGalleryView posts={posts} source={isOwner ? 'me' : 'other_user'} />
  ) : (
    <EmptyStateView type={ProfileScreenType.USER} />
  );
}

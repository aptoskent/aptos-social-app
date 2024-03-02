import { gql, useQuery as useGraphqlQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const getGroupsQuery = gql`
  query GetGroups($userId: uuid) {
    user_group_edge(where: { user_id: { _eq: $userId } }) {
      group_id
    }
  }
`;

export const useGetSharedGroups = (
  user1Id: string,
  user2Id: string,
): string[] => {
  const [user1Groups, setUser1Groups] = useState<string[]>([]);
  const [user2Groups, setUser2Groups] = useState<string[]>([]);
  const [sharedGroups, setSharedGroups] = useState<string[]>([]);

  const {
    loading: loading1,
    error: error1,
    refetch: refetch1,
  } = useGraphqlQuery(getGroupsQuery, {
    variables: { userId: user1Id },
  });

  const {
    loading: loading2,
    error: error2,
    refetch: refetch2,
  } = useGraphqlQuery(getGroupsQuery, {
    variables: { userId: user2Id },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await refetch1();
        const groups = data.data.user_group_edge.map(
          (edge: any) => edge.group_id,
        );
        setUser1Groups(groups);
      } catch (error) {
        // Handle error if necessary
      }
    };

    fetchData();
  }, [user1Id, refetch1]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await refetch2();
        const groups = data.data.user_group_edge.map(
          (edge: any) => edge.group_id,
        );
        setUser2Groups(groups);
      } catch (error) {
        // Handle error if necessary
      }
    };

    fetchData();
  }, [user1Id, refetch2]);

  useEffect(() => {
    if (user1Groups.length > 0 && user2Groups.length > 0) {
      const shared = user1Groups.filter((groupId: string) =>
        user2Groups.includes(groupId),
      );
      setSharedGroups(shared);
    }
  }, [user1Groups, user2Groups]);

  if (loading1 || loading2 || error1 || error2) {
    return [];
  }

  return sharedGroups;
};

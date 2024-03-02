import { gql, useQuery as useGraphqlQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

const getIsMyGroupQuery = gql`
  query GetIsMyGroup($userId: uuid, $groupId: uuid) {
    user_group_edge(
      where: { user_id: { _eq: $userId }, group_id: { _eq: $groupId } }
    ) {
      id
    }
  }
`;

export const useGetIsMyGroup = (userId: string, groupId: string): boolean => {
  const [isMyGroup, setIsMyGroup] = useState<boolean>(false);

  const { loading, error, refetch } = useGraphqlQuery(getIsMyGroupQuery, {
    variables: {
      userId: userId,
      groupId: groupId,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await refetch();
        const userGroupEdges = data.data.user_group_edge;
        if (userGroupEdges.length > 0) {
          setIsMyGroup(true);
        }
      } catch (error) {
        // Handle error if necessary
      }
    };

    fetchData();
  }, [userId, groupId, refetch]);

  return isMyGroup;
};

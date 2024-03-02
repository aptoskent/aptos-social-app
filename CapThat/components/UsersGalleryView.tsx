import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import Icon from 'react-native-remix-icon';

// query
import { getMembersForGroupIdQuery } from '../gql/getGroupQuery';
import { useQuery } from '@apollo/client';
import {
  UserPfpSize,
  UserProfilePictureWithFallback,
} from './profile_picture/UserProfilePicture';

// styles
import tw from '../tailwind.js';
import { GetMembersForGroupIdQueryQuery } from '../__generated__/graphql';

const FONT_CLASH_REGULAR = { fontFamily: 'clash-grotesk-regular' };
const FONT_CLASH_SEMI_BOLD = { fontFamily: 'clash-grotesk-semibold' };

type Props = {
  groupId: string;
  groupName: string;
  maxRow?: number;
  numColumns?: number;
};

const UsersGalleryView = (props: Props) => {
  const { groupId, groupName = '', maxRow = 3, numColumns = 4 } = props;
  const maxItemsInGrid = maxRow * numColumns;
  const [usersArr, setUsersArr] = useState<
    GetMembersForGroupIdQueryQuery['group'][0]['group_user_edges'][0]['user'][]
  >([]);

  const { data } = useQuery(getMembersForGroupIdQuery, {
    variables: {
      group_id: groupId,
    },
  });

  const gridData = useMemo(() => {
    return usersArr?.slice(0, maxItemsInGrid);
  }, [maxItemsInGrid, usersArr]);

  useEffect(() => {
    if (data) {
      const currentGroup = data.group[0];
      const members = currentGroup?.group_user_edges?.map((edge) => edge.user);
      if (members?.length) {
        setUsersArr(members);
      }
    }
  }, [data]);

  const renderItem = useCallback(
    ({ item, index }) => {
      const firstName = item?.full_name?.first_name;

      if (index === maxItemsInGrid - 1) {
        const remainingUsers = usersArr.length - maxItemsInGrid;
        return (
          <View key={index + 'more'} style={tw('mx-2.5 items-center')}>
            <View
              style={tw(
                'items-center justify-center rounded-2xl h-14 w-14 mb-2 border',
                { borderColor: '#444A5E' },
              )}
            >
              <Icon name="group-line" size="21" color="white" />
            </View>
            <Text
              style={tw('text-white text-sm', FONT_CLASH_REGULAR)}
            >{`+ ${remainingUsers} more`}</Text>
          </View>
        );
      }
      return (
        <View key={index + '_' + item?.id} style={tw('mx-2.5 items-center')}>
          <UserProfilePictureWithFallback
            userData={item}
            size={UserPfpSize.MEDIUM}
          />
          <Text style={tw('text-white text-sm mt-2', FONT_CLASH_REGULAR)}>
            {firstName}
          </Text>
        </View>
      );
    },
    [maxItemsInGrid, usersArr.length],
  );

  if (!gridData?.length) {
    return null;
  }

  return (
    <>
      <View style={tw('items-center mb-6')}>
        <Text
          style={tw(
            'text-white mb-8 font-semibold text-base',
            FONT_CLASH_SEMI_BOLD,
          )}
        >
          Who can see this?
        </Text>
        <Text
          style={tw('text-white text-base', FONT_CLASH_REGULAR)}
        >{`Only members of ${groupName} can see this`}</Text>
      </View>
      <FlatList
        data={gridData}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={tw('gap-6 justify-center px-2 pb-4')}
      />
    </>
  );
};

export default UsersGalleryView;

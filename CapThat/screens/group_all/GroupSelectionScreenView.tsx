import { ScrollView, StyleSheet, View } from 'react-native';
import { useContext } from 'react';
import { SCREEN_NAME_GROUP_CREATION } from '../../nav/constants';
import { GroupSelectionScreenGroupPicture } from '../profile/ProfileScreenGroupPicture';
import Heading1 from '../../components/text/Heading1';
import PrimaryButton from '../../components/button/PrimaryButton';
import { useQuery } from '@apollo/client';
import {
  getMyGroupsQuery,
  getUserGroupsWithTestingGroupsQuery,
  getUserGroupsWithoutTestingGroupsQuery,
} from '../../gql/getUserGroupsQuery';
import { UserGroupEdge } from '../../components/gallery/dataHelper';
import GlobalText from '../../components/text/GlobalText';
import { AuthContext } from '../../auth/AuthContext';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import ErrorView from '../../components/error_state/ErrorView';
import { TypedToast } from 'CapThat/components/TypedToast';
import { ToastType } from 'CapThat/components/TypedToast';

const GROUPS_PER_ROW = 4;

function splitIntoRows<Group>(list: Group[], numPerRow: number): Group[][] {
  const rows: Group[][] = [];
  let row: Group[] = [];

  for (let i = 0; i < list.length; i++) {
    row.push(list[i]);

    if (row.length === numPerRow || i === list.length - 1) {
      rows.push(row);
      row = [];
    }
  }

  return rows;
}

type GroupSelectionScreenViewProps = {
  userId: string;
  username: string;
};

export default function GroupSelectionScreenView({
  userId,
  username,
}: GroupSelectionScreenViewProps) {
  const navigation = useTypedNavigation();
  const { userId: loggedInUserId, user } = useContext(AuthContext);
  const isOwner = loggedInUserId === userId;
  const { data, loading, error } = useQuery(
    isOwner
      ? getMyGroupsQuery
      : user?.is_test_user
      ? getUserGroupsWithTestingGroupsQuery
      : getUserGroupsWithoutTestingGroupsQuery,
    {
      variables: { user_id: userId },
    },
  );
  if (error) {
    return <ErrorView />;
  }
  if (loading) {
    return <View />;
  }

  if (data.user.length !== 1) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  const userGroupEdges: UserGroupEdge[] = data.user[0].user_group_edges;
  const groups = userGroupEdges.map((edge) => edge.group);
  const groupRows = splitIntoRows(groups, GROUPS_PER_ROW);

  const handleCreateGroup = () => {
    navigation.navigate(SCREEN_NAME_GROUP_CREATION, {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Heading1>{username}</Heading1>
        <GlobalText>{groups.length} groups total</GlobalText>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.rowsContainer}>
          {groupRows.map((groupRow, idx) => {
            return (
              <View key={idx} style={styles.rowContainer}>
                {groupRow.map((groupData, idx) => {
                  return (
                    <GroupSelectionScreenGroupPicture
                      key={idx}
                      groupData={groupData}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <PrimaryButton title="Create New Group" onPress={handleCreateGroup} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -20,
  },
  titleContainer: {
    gap: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  rowsContainer: {
    gap: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  buttonsContainer: {
    justifyContent: 'flex-end',
    flex: 1,
    minHeight: 60, // a hack to make the scroll view not cover the button
  },
});

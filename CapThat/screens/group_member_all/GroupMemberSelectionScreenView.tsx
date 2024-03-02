import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import Heading1 from '../../components/text/Heading1';
import { User } from '../../components/gallery/dataHelper';
import GlobalText from '../../components/text/GlobalText';
import UserProfileTouchableMedium from '../../components/profile_picture/UserProfileTouchableMedium';

const MEMBERS_PER_ROW = 4;

function splitIntoRows<User>(list: User[], numPerRow: number): User[][] {
  const rows: User[][] = [];
  let row: User[] = [];

  for (let i = 0; i < list.length; i++) {
    row.push(list[i]);

    if (row.length === numPerRow || i === list.length - 1) {
      rows.push(row);
      row = [];
    }
  }

  return rows;
}

type GroupMemberSelectionScreenViewProps = {
  groupName: string;
  members: User[];
};

export default function GroupSelectionScreenView({
  groupName,
  members,
}: GroupMemberSelectionScreenViewProps) {
  const memberRows = splitIntoRows(members, MEMBERS_PER_ROW);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Heading1>{groupName}</Heading1>
        <GlobalText>{members.length} members</GlobalText>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.rowsContainer}>
          {memberRows.map((memberRow, idx) => {
            return (
              <View key={idx} style={styles.rowContainer}>
                {memberRow.map((memberData, idx) => {
                  return (
                    <UserProfileTouchableMedium
                      key={idx}
                      userData={memberData}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
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

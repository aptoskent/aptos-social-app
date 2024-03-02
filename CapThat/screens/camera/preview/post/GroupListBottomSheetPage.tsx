import Icon from 'react-native-remix-icon';
import { TouchableOpacity, View } from 'react-native';
import {
  HexagonImageType,
  SECONDARY_SIZE,
} from '../../../../components/profile_picture_mascot/HexagonImage';
import SupportingText from '../../../../components/text/SupportingText';
import GroupMascot from '../../../../components/profile_picture_mascot/GroupMascot';
import { CustomBottomSheetButton } from '../../../../components/sheet/BottomSheetButton';
import UsersGalleryView from '../../../../components/UsersGalleryView';
import { Group } from '../../../../components/gallery/dataHelper';

// styles
import tw from '../../../../tailwind.js';

export const LIMIT = 12;
const NUM_OF_COLS = LIMIT / 3; // 3 rows

export type GroupPage = {
  groups: Group[];
};

type GroupListBottomSheetPageProps = {
  pageData: GroupPage;
  onPostToGroup: (groupId: string) => void;
  bottomSheetContentWidth: number;
};

export default function GroupListBottomSheetPage({
  pageData,
  onPostToGroup,
  bottomSheetContentWidth,
}: GroupListBottomSheetPageProps) {
  const firstRowGroups = pageData.groups.slice(0, NUM_OF_COLS);
  const secondRowGroups = pageData.groups.slice(NUM_OF_COLS, 2 * NUM_OF_COLS);
  const thirdRowGroups = pageData.groups.slice(
    2 * NUM_OF_COLS,
    3 * NUM_OF_COLS,
  );

  return (
    <View style={{ width: bottomSheetContentWidth, gap: 8 }}>
      <GroupListBottomSheetRow
        groups={firstRowGroups}
        onPostToGroup={onPostToGroup}
        bottomSheetContentWidth={bottomSheetContentWidth}
      />
      {secondRowGroups.length > 0 && (
        <GroupListBottomSheetRow
          groups={secondRowGroups}
          onPostToGroup={onPostToGroup}
          bottomSheetContentWidth={bottomSheetContentWidth}
        />
      )}
      {thirdRowGroups.length > 0 && (
        <GroupListBottomSheetRow
          groups={thirdRowGroups}
          onPostToGroup={onPostToGroup}
          bottomSheetContentWidth={bottomSheetContentWidth}
        />
      )}
    </View>
  );
}

type GroupListBottomSheetRowProps = {
  groups: Group[];
  onPostToGroup: (groupId: string) => void;
  bottomSheetContentWidth: number;
};

function GroupListBottomSheetRow({
  groups,
  onPostToGroup,
  bottomSheetContentWidth,
}: GroupListBottomSheetRowProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {groups.map((group) => {
        return (
          <TouchableOpacity
            key={group.id}
            onPress={() => onPostToGroup(group.id)}
            style={{
              width: bottomSheetContentWidth / NUM_OF_COLS,
              alignItems: 'center',
              padding: 4,
              gap: 8,
            }}
          >
            <GroupMascot
              isTestGroup={group.is_test_group}
              type={HexagonImageType.SECONDARY}
              groupPfpSerialNumber={group.profile_picture_serial_number}
              groupTestPfpSerialNumber={
                group.test_group_profile_picture_serial_number
              }
            />
            <View
              style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}
            >
              {group.is_private && (
                <CustomBottomSheetButton
                  buttonContentComponent={
                    <Icon name="lock-line" size="12" color="white" />
                  }
                  sheetContentComponent={
                    <UsersGalleryView
                      groupName={group.name}
                      groupId={group.id}
                    />
                  }
                  exitSheet={false}
                  propsStyle={{ wrapper: tw('bg-black bg-opacity-50') }}
                />
              )}
              <SupportingText
                singleLine
                maxWidth={
                  group.is_private ? SECONDARY_SIZE - 20 : SECONDARY_SIZE
                }
              >
                {group.name}
              </SupportingText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

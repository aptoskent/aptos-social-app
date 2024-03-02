import analytics from '@react-native-firebase/analytics';
import { FlatList, StyleSheet, View, Dimensions } from 'react-native';
import Icon from 'react-native-remix-icon';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../auth/AuthContext';
import { CustomBottomSheetButton } from '../../../../components/sheet/BottomSheetButton';
import PrimaryButton from '../../../../components/button/PrimaryButton';
import { SCREEN_NAME_GROUP_CREATION } from '../../../../nav/constants';
import {
  GLOBAL_PRIMARY_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../../../constants';
import { BOTTOM_SHEET_MARGIN_HORIZONTAL } from '../../../../components/sheet/BottomSheet';
import PaginationDot from 'react-native-insta-pagination-dots';
import GroupListBottomSheetPage, {
  GroupPage,
  LIMIT,
} from './GroupListBottomSheetPage';
import { useQuery } from '@apollo/client';
import {
  getMyGroupCountQuery,
  getMyGroupsQuery,
} from '../../../../gql/getUserGroupsQuery';
import { Group } from '../../../../components/gallery/dataHelper';
import { useTypedNavigation } from '../../../../hooks/useTypedNavigation';
import { TypedToast } from 'CapThat/components/TypedToast';
import { ToastType } from 'CapThat/components/TypedToast';

const SHEET_TITLE = 'Post to ...';
const PAGINATION_DOT_COLOR = '#FFFFFF';

const bottomSheetContentWidth =
  Dimensions.get('window').width -
  2 * GLOBAL_SCREEN_MARGIN_HORIZONTAL -
  2 * BOTTOM_SHEET_MARGIN_HORIZONTAL;

type GroupListBottomSheetButtonProps = {
  submitPost: (groupId: string) => void;
};

// TODO: display the groups as in the design, also handle when there're more than 8 groups
export default function GroupListBottomSheetButton({
  submitPost,
}: GroupListBottomSheetButtonProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);
  const [exitBottomSheet, setExitBottomSheet] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pages, setPages] = useState<GroupPage[]>([]);
  const [curPage, setCurPage] = useState<number>(0);

  const {
    data: groupCountData,
    loading: getGroupCountLoading,
    error: getGroupCountError,
    // TODO: @jianyi we probably need this since we should refetch if user create a new group
    // refetch: refetchGroupCount,
  } = useQuery(getMyGroupCountQuery, {
    variables: {
      user_id: userId,
    },
  });

  const {
    data: groupsData,
    loading: getGroupsLoading,
    error: getGroupsError,
  } = useQuery(getMyGroupsQuery, {
    variables: {
      user_id: userId,
    },
  });

  useEffect(() => {
    if (!groupCountData) {
      return;
    }
    // initialize groupCount, pageCount, curPage
    if (groupCountData.user.length !== 1) {
      TypedToast.show({ type: ToastType.ERROR });
    }
    const groupCountNum =
      groupCountData.user[0].user_group_edges_aggregate.aggregate.count;
    const pageCountNum = Math.ceil(groupCountNum / LIMIT);
    setPageCount(pageCountNum);
    setCurPage(0);
  }, [groupCountData]);

  useEffect(() => {
    if (!groupsData) {
      return;
    }
    if (groupsData.user.length !== 1) {
      TypedToast.show({ type: ToastType.ERROR });
    }
    const groups: Group[] = groupsData.user[0].user_group_edges.map(
      (edge: any) => edge.group,
    );
    for (let i = 0; i < groups.length; i += LIMIT) {
      setPages((prevPages) =>
        prevPages.concat({ groups: groups.slice(i, i + LIMIT) }),
      );
    }
  }, [groupsData]);

  const renderPage = ({ item }) => {
    const submitPostToGroup = (groupId: string) => {
      setExitBottomSheet(true);
      submitPost(groupId);
      // LOG EVENT
      analytics().logEvent('button', {
        user_id: userId,
        button: 'confirm_group',
        target_group_id: groupId,
      });
    };

    return (
      <GroupListBottomSheetPage
        pageData={item}
        onPostToGroup={submitPostToGroup}
        bottomSheetContentWidth={bottomSheetContentWidth}
      />
    );
  };

  const createNewGroup = () => {
    setExitBottomSheet(true);
    navigation.navigate(SCREEN_NAME_GROUP_CREATION, { submitPost: submitPost });
  };

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const pageIdx = Math.floor(contentOffset.x / layoutMeasurement.width);
    setCurPage(pageIdx);
  };

  if (getGroupCountLoading || getGroupsLoading) {
    return <View />;
  }

  if (getGroupsError || getGroupCountError) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  return (
    <CustomBottomSheetButton
      exitSheet={exitBottomSheet}
      buttonContentComponent={
        <View
          style={{
            backgroundColor: GLOBAL_PRIMARY_COLOR,
            padding: 16,
            borderRadius: 16,
          }}
        >
          <Icon name="send-plane-2-fill" size="22" color="white" />
        </View>
      }
      sheetTitle={SHEET_TITLE}
      sheetContentComponent={
        <View>
          <FlatList
            data={pages}
            renderItem={renderPage}
            onScroll={handleScroll}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
          />
          <View style={styles.paginationDotContainer}>
            {pageCount > 1 && (
              <PaginationDot
                activeDotColor={PAGINATION_DOT_COLOR}
                curPage={curPage}
                maxPage={pageCount}
              />
            )}
          </View>
          <PrimaryButton title="Create New Group" onPress={createNewGroup} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  paginationDotContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
});

import GroupScreenHeader from './GroupScreenHeader';
import GroupScreenView from './GroupScreenView';
import { useQuery } from '@apollo/client';
import { getGroupQuery } from '../../gql/getGroupQuery';
import InProgressSpinner from '../../components/InProgressSpinner';
import { useEffect, useState } from 'react';
import { Group } from '../../components/gallery/dataHelper';
import { useGetGroupHeaderBackgroundColors } from '../../hooks/useGetGroupHeaderBackgroundColors';
import MainScreen from '../../components/main_screen/MainScreen';
import { GetGroupQueryQuery } from '../../__generated__/graphql';
import { TypedToast } from '../../components/TypedToast';
import { ToastType } from '../../components/TypedToast';

type GroupScreenProps = {
  route: any;
};
export default function GroupScreen({ route }: GroupScreenProps) {
  const [groupData, setGroupData] = useState<
    GetGroupQueryQuery['group'][0] | null
  >(null);
  const { groupId, groupAction } = route.params;
  const [groupMascotSerialNumber, setGroupMascotSerialNumber] =
    useState<number>(0);

  const { data, loading, error } = useQuery(getGroupQuery, {
    variables: {
      group_id: groupId,
    },
  });
  const headerColors = useGetGroupHeaderBackgroundColors(
    groupMascotSerialNumber,
  );

  useEffect(() => {
    if (data) {
      setGroupData(data.group[0]);
      setGroupMascotSerialNumber(
        data.group[0]?.profile_picture_serial_number ?? 0,
      );
    }
  }, [data]);

  if (error) {
    TypedToast.show({ type: ToastType.ERROR });
  }
  if (loading) {
    return <InProgressSpinner inProgress={loading} />;
  }

  return (
    <MainScreen
      backgroundColorPrimary={headerColors.primary}
      backgroundColorSecondary={headerColors.secondary}
    >
      {groupData ? (
        <>
          <GroupScreenHeader groupData={groupData} groupAction={groupAction} />
          <GroupScreenView groupData={groupData} />
        </>
      ) : (
        <InProgressSpinner inProgress={loading} />
      )}
    </MainScreen>
  );
}

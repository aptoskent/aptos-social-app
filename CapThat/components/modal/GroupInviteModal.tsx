import { useEffect, useState } from 'react';
import { StyleSheet, Modal, View } from 'react-native';
import PrimaryButton from '../button/PrimaryButton';
import SupportingButton from '../button/SupportingButton';
import { HexagonImageType } from '../profile_picture_mascot/HexagonImage';
import Heading1 from '../text/Heading1';
import { getGroupQuery } from '../../gql/getGroupQuery';
import { AuthContext } from '../../auth/AuthContext';
import { useContext } from 'react';
import { SCREEN_NAME_GROUP } from '../../nav/constants';
import { useMutation, useQuery } from '@apollo/client';
import { insertUserGroupEdgeMutation } from '../../gql/insertUserGroupEdgeMutation';
import { getMyGroupsQuery } from '../../gql/getUserGroupsQuery';
import GlobalText from '../text/GlobalText';
import GroupMascot from '../profile_picture_mascot/GroupMascot';
import { GroupActionType } from '../../screens/group/GroupActionType';
import analytics from '@react-native-firebase/analytics';
import { TEXT_COLOR_PRIMARY } from '../text/constants';
import tw from '../../tailwind.js';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { GetGroupQueryQuery } from '../../__generated__/graphql';
import { TypedToast } from '../TypedToast';
import { ToastType } from '../TypedToast';

type GroupInviteModalProps = {
  groupId: string | null;
  setIsMyGroupOverride?: (isMyGroup: boolean) => void;
};

export default function GroupInviteModal({
  groupId,
  setIsMyGroupOverride,
}: GroupInviteModalProps) {
  const navigation = useTypedNavigation();
  if (groupId == null) {
    return null;
  }

  const [group, setGroup] = useState<GetGroupQueryQuery['group'][0]>();
  const [modalVisible, setModalVisible] = useState(false);
  const { userId } = useContext(AuthContext);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (groupId && groupId !== '') {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [groupId]);

  const { loading: getGroupLoading, error: getGroupError } = useQuery(
    getGroupQuery,
    {
      variables: {
        group_id: groupId,
      },
      onCompleted: (data) => {
        if (!data) {
          console.log('No group data');
          return;
        } else if (data.group.length < 1) {
          console.log('No groups returned');
          return;
        }
        setGroup(data.group[0]);
        const members = data.group[0].group_user_edges.map((edge) => edge.user);
        if (members.length < 2) {
          setGreeting(`with ${members[0]?.username}`);
        } else if (members.length === 2) {
          setGreeting(
            `with ${members[0]?.username} and ${members[1]?.username}`,
          );
        } else {
          setGreeting(
            `with ${members[0]?.username}, ${members[1]?.username} and ${
              members.length - 1
            } ${members.length - 1 > 1 ? 'others' : 'other'}`,
          );
        }
      },
    },
  );

  const [
    insertGroup,
    { loading: insertGroupLoading, error: insertGroupError },
  ] = useMutation(insertUserGroupEdgeMutation, {
    variables: {
      user_id: userId,
      group_id: groupId,
    },
    refetchQueries: [
      {
        query: getMyGroupsQuery,
        variables: {
          user_id: userId,
        },
      },
    ],
  });
  if (getGroupError || insertGroupError) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  const closeModal = () => {
    setModalVisible(false);
  };

  const onAcceptInvite = async () => {
    const createdGroupId = await insertGroup().then(async (result) => {
      const groupId = result.data.insert_user_group_edge.returning[0].group_id;

      // LOG EVENT
      await analytics().logEvent('button', {
        user_id: userId,
        button: 'confirm_join_group',
        source: `https://capthat.page.link/${groupId}`,
        target_group_id: groupId,
      });

      return groupId;
    });
    setModalVisible(false);
    setIsMyGroupOverride?.(true);
    navigation.navigate(SCREEN_NAME_GROUP, {
      groupId: createdGroupId,
      groupAction: GroupActionType.JOIN_GROUP,
    });
  };

  const onDeclineInvite = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.centeredView}>
        {group && (
          <View style={styles.modalView}>
            <GroupMascot
              isTestGroup={group.is_test_group}
              type={
                group.is_private
                  ? HexagonImageType.PRIMARY_WITH_LOCK
                  : HexagonImageType.PRIMARY
              }
              groupPfpSerialNumber={group.profile_picture_serial_number}
              groupTestPfpSerialNumber={
                group.test_group_profile_picture_serial_number
              }
            />
            <View style={{ gap: 8 }}>
              <Heading1>
                {`Join the ${group.is_private ? 'private' : 'public'} group ' ${
                  group.name
                }'?`}
              </Heading1>
              <GlobalText propStyles={{ textAlign: 'center' }}>
                {greeting}
              </GlobalText>
            </View>
            <View style={styles.buttons}>
              <PrimaryButton
                propStyles={tw('w-36')}
                title="Join"
                onPress={onAcceptInvite}
              />
              <SupportingButton
                title="Decline"
                onPress={onDeclineInvite}
                textColor={TEXT_COLOR_PRIMARY}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

// TODO: (zihan) generalize modal style and Modal component
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    width: '70%',
    backgroundColor: 'rgba(74, 68, 94, 1)',
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 4,
  },
  buttons: {
    alignItems: 'center',
    gap: 16,
  },
});

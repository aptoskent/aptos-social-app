import { ScrollView, StyleSheet, View } from 'react-native';
import Heading2 from '../../components/text/Heading2';
import SupportingText from '../../components/text/SupportingText';
import { useEffect, useState } from 'react';
import PrimaryButton from '../../components/button/PrimaryButton';
import Divider from '../../components/Divider';
import { SCREEN_NAME_GROUP } from '../../nav/constants';
import { useContext } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import {
  insertNonTestGroupMutation,
  insertTestGroupMutation,
} from '../../gql/insertGroupMutation';
import { useMutation, useQuery } from '@apollo/client';
import TextField from '../../components/TextField';
import ToggleSwitch from '../../components/ToggleSwitch';
import InProgressSpinner from '../../components/InProgressSpinner';
import { getMyGroupsQuery } from '../../gql/getUserGroupsQuery';
import { getLastMascotImageUnusedQuery } from '../../gql/getMascotImagesUnusedQuery';
import { MascotShuffle } from './MascotShuffle';
import { MascotImage } from '../../components/gallery/dataHelper';
import { GroupActionType } from '../group/GroupActionType';
import { TestMascotShuffle } from './TestMascotShuffle';
import analytics from '@react-native-firebase/analytics';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { TypedToast } from '../../components/TypedToast';
import { ToastType } from '../../components/TypedToast';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 20;

type GroupCreationScreenViewProps = {
  submitPost?: (groupId: string) => void;
};

// TODO: THIS FILE NEEDS SOME SERIOUS CLEANUP
export default function GroupCreationScreenView({
  submitPost,
}: GroupCreationScreenViewProps) {
  const navigation = useTypedNavigation();
  const { userId, user } = useContext(AuthContext);
  const [groupName, setGroupName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isTestGroup, setIsTestGroup] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [randomMascotImageUnusedId, setRandomMascotImageUnusedId] =
    useState<number>();
  const [selectedMascotImage, setSelectedMascotImage] = useState<MascotImage>();
  const [selectedTestMascotImage, setSelectedTestMascotImage] =
    useState<MascotImage>();

  useEffect(() => {
    if (user?.is_test_user) {
      setIsTestGroup(true);
    }
  }, [user?.is_test_user]);

  const {
    loading: getLastUnusedMascotLoading,
    error: getLastUnusedMascotError,
  } = useQuery(getLastMascotImageUnusedQuery, {
    onCompleted: (result) => {
      if (result.mascot_image_unused.length === 0) {
        TypedToast.show({ type: ToastType.ERROR });
      }
      const lastUnusedMascotId = result.mascot_image_unused[0].id;
      const randomUnusedMascotId = Math.max(
        Math.floor(Math.random() * lastUnusedMascotId - 3),
        0,
      );
      setRandomMascotImageUnusedId(randomUnusedMascotId);
    },
  });

  const [insertNonTestGroup] = useMutation(insertNonTestGroupMutation, {
    variables: {
      user_id: userId,
      name: groupName,
      is_private: isPrivate,
      profile_picture_img_id: 0,
      profile_picture_serial_number: 0,
      profile_picture_img_url: '',
      profile_picture_background_colors: {},
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

  const [insertTestGroup] = useMutation(insertTestGroupMutation, {
    variables: {
      user_id: userId,
      name: groupName,
      is_private: isPrivate,
      test_group_profile_picture_serial_number: 0,
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

  const onGroupNameChange = (text: string) => {
    setGroupName(text);
  };

  const toggleIsPrivate = () => {
    setIsPrivate((isPrivate) => !isPrivate);
  };

  const toggleIsTestGroup = () => {
    // comment out the following line to disable the toggle before launch
    // setIsTestGroup((isTestGroup) => !isTestGroup);
  };

  const createGroupAndGoToInviteScreen = () => {
    if (
      !groupName ||
      groupName.length < MIN_NAME_LENGTH ||
      groupName.length > MAX_NAME_LENGTH
    ) {
      // TODO: show error message
      return;
    }

    setIsCreating(true);
    // TODO: @jianyi handle race condition, another user used the mascot to create a group first

    if (isTestGroup) {
      if (!selectedTestMascotImage) {
        return;
      }
      insertTestGroup({
        variables: {
          user_id: userId,
          name: groupName,
          is_private: isPrivate,
          test_group_profile_picture_serial_number:
            selectedTestMascotImage.serial_number,
        },
      })
        .then(async (result) => {
          const createdGroupId =
            result.data.insert_user_group_edge.returning[0].group.id;
          if (submitPost) {
            submitPost(createdGroupId);
          }
          navigation.navigate(SCREEN_NAME_GROUP, {
            groupId: createdGroupId,
            groupAction: GroupActionType.CREATE_GROUP,
          });

          // LOG EVENT
          await analytics().logEvent('button', {
            user_id: userId,
            button: 'confirm_create_group',
            source: submitPost ? 'camera' : 'me',
            target_group_id: createdGroupId,
            target_mascot_serial_number: selectedTestMascotImage.serial_number,
            target_group_is_test: true,
          });
        })
        .finally(() => {
          setIsCreating(false);
        });
    } else {
      if (!selectedMascotImage) {
        return;
      }
      insertNonTestGroup({
        variables: {
          user_id: userId,
          name: groupName,
          is_private: isPrivate,
          profile_picture_img_id: selectedMascotImage.id,
          profile_picture_serial_number: selectedMascotImage.serial_number,
          profile_picture_img_url: selectedMascotImage.img_url,
          profile_picture_background_colors:
            selectedMascotImage.background_colors,
        },
      })
        .then(async (result) => {
          const createdGroupId =
            result.data.insert_user_group_edge.returning[0].group.id;
          if (submitPost) {
            submitPost(createdGroupId);
          }
          navigation.navigate(SCREEN_NAME_GROUP, {
            groupId: createdGroupId,
            groupAction: GroupActionType.CREATE_GROUP,
          });

          // LOG EVENT
          await analytics().logEvent('button', {
            user_id: userId,
            button: 'confirm_create_group',
            source: submitPost ? 'camera' : 'me',
            target_group_id: createdGroupId,
            target_mascot_serial_number: selectedMascotImage.serial_number,
            target_group_is_test: false,
          });
        })
        .finally(() => {
          setIsCreating(false);
        });
    }
  };

  const onChangeSelectedMascotImage = (mascotImage: MascotImage) => {
    setSelectedMascotImage(mascotImage);
  };

  const onChangeSelectedTestMascotImage = (mascotImage: MascotImage) => {
    setSelectedTestMascotImage(mascotImage);
  };

  if (getLastUnusedMascotLoading) {
    return <InProgressSpinner inProgress={getLastUnusedMascotLoading} />;
  }

  if (getLastUnusedMascotError) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  return (
    <View style={styles.container}>
      <InProgressSpinner inProgress={isCreating} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}
      >
        <TextField
          title="Group Name"
          placeholder="Add Name"
          value={groupName}
          onTextChange={onGroupNameChange}
          fontSize={20}
          fontBold
          maxLength={MAX_NAME_LENGTH}
        />
        {user?.is_test_user && (
          <View style={styles.sectionContainer}>
            <Divider text="Test Group" />
            <View style={styles.section}>
              <View style={styles.texts}>
                <Heading2>Make this group a test group</Heading2>
                <SupportingText>
                  Only test users will be able to see this group.
                </SupportingText>
              </View>
              <ToggleSwitch isOn={isTestGroup} toggle={toggleIsTestGroup} />
            </View>
          </View>
        )}
        <View style={styles.sectionContainer}>
          <Divider text="Privacy" />
          <View style={styles.section}>
            <View style={styles.texts}>
              <Heading2>Make this group private</Heading2>
              <SupportingText>
                Only members will be able to see and search for this group.
              </SupportingText>
            </View>
            <ToggleSwitch isOn={isPrivate} toggle={toggleIsPrivate} />
          </View>
        </View>
        {!isTestGroup && randomMascotImageUnusedId !== undefined ? (
          <MascotShuffle
            randomMascotImageUnusedId={randomMascotImageUnusedId}
            selectedMascotImage={selectedMascotImage}
            onChangeSelectedMascotImage={onChangeSelectedMascotImage}
          />
        ) : (
          <TestMascotShuffle
            selectedTestMascotImage={selectedTestMascotImage}
            onChangeSelectedTestMascotImage={onChangeSelectedTestMascotImage}
          />
        )}
      </ScrollView>
      <View style={styles.buttonsContainer}>
        <PrimaryButton
          disabled={
            (!selectedMascotImage && !selectedTestMascotImage) || !groupName
          }
          title="Next"
          onPress={createGroupAndGoToInviteScreen}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollViewContainer: {
    gap: 24,
    padding: 0,
  },
  sectionContainer: {
    gap: 8,
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  texts: {
    flex: 1,
    gap: 4,
  },
  buttonsContainer: {
    justifyContent: 'flex-end',
  },
});

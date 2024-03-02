import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import Icon from 'react-native-remix-icon';
import BottomSheetButton from '../../components/sheet/BottomSheetButton';
import { BottomSheetActionType } from '../../components/sheet/BottomSheet';
import { SCREEN_NAME_EDIT_POST } from '../../nav/constants';
import { AuthContext } from '../../auth/AuthContext';
import { Post } from '../../components/gallery/dataHelper';
import { insertPostReportMutation } from '../../gql/insertPostReportMutation';
import { useMutation } from '@apollo/client';
import InProgressSpinner from '../../components/InProgressSpinner';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type PostMoreOptionButtonProps = {
  post: Post;
  openPostDeleteModal?: () => void;
};

export function PostMoreOptionButton({
  post,
  openPostDeleteModal,
}: PostMoreOptionButtonProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);
  const [showReportOverlay, setShowReportOverlay] = useState(false);

  const [insertPostReport, { loading, error }] = useMutation(
    insertPostReportMutation,
    {
      variables: {
        // default value, real value set when insertPostReport is called
        post_id: post.id,
        reported_by_user_id: userId,
      },
    },
  );

  const isAuthor = userId === post.photo_post.created_by_user.id;

  const editPost = () => {
    if (!isAuthor) {
      return;
    }

    navigation.navigate(SCREEN_NAME_EDIT_POST, {
      post,
    });
  };

  const deletePost = () => {
    if (openPostDeleteModal) {
      openPostDeleteModal();
    }
  };

  const confirmReportPost = () => {
    insertPostReport({
      variables: {
        post_id: post.id,
        reported_by_user_id: userId,
      },
    })
      .then((result) => {
        showReportFeedbackFor2Seconds();
      })
      .catch((e) => {
        showReportFeedbackFor2Seconds();
      });
  };

  const reportPost = () => {
    Alert.alert(
      `We're sorry that this post is upsetting`,
      `If you feel strongly that this content doesn't belong on our platform, we'll review it`,
      [
        {
          text: 'Report',
          onPress: confirmReportPost,
          style: 'destructive',
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  const showReportFeedbackFor2Seconds = () => {
    setShowReportOverlay(true);
    // Reset the flag after a delay of 500ms
    setTimeout(() => setShowReportOverlay(false), 2000);
  };

  return (
    <>
      <InProgressSpinner inProgress={showReportOverlay} />
      <BottomSheetButton
        buttonContentComponent={
          <Icon name="more-2-fill" size="22" color="white" />
        }
        sheetTitle="Post Options..."
        sheetActions={
          isAuthor
            ? [
                {
                  name: 'Edit Post',
                  iconName: 'edit-fill',
                  actionType: BottomSheetActionType.REGULAR,
                  actionFunction: editPost,
                },
                {
                  name: 'Delete',
                  iconName: 'delete-bin-5-fill',
                  actionType: BottomSheetActionType.WARNING,
                  actionFunction: deletePost,
                },
              ]
            : [
                {
                  name: 'Report Post',
                  iconName: 'alarm-warning-fill',
                  actionType: BottomSheetActionType.WARNING,
                  actionFunction: reportPost,
                },
              ]
        }
      />
    </>
  );
}

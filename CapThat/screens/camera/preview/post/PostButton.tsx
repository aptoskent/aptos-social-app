import analytics from '@react-native-firebase/analytics';
import { StyleSheet, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../../auth/AuthContext';
import { StackActions } from '@react-navigation/native';
import { insertPostMutation } from '../../../../gql/insertPostMutation';
import { SCREEN_NAME_GROUP } from '../../../../nav/constants';
import InProgressSpinner from '../../../../components/InProgressSpinner';
import PostToGroupButton from './PostToGroupButton';
import { useMutation } from '@apollo/client';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../../../constants';
import { ActionType } from '../../ActionType';
import PostToCurrentGroupButton from './PostToCurrentGroupButton';
import {
  createPostNotification,
  PostNotification,
} from '../../../../notification/sendNotification';
import { IMAGE_FORMAT } from '../../ratio';
import { useTypedNavigation } from '../../../../hooks/useTypedNavigation';
import { TypedToast } from 'CapThat/components/TypedToast';
import { ToastType } from 'CapThat/components/TypedToast';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type PostImageButtonProps = {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  thumbnailUri: string;
  caption: string;
  action: ActionType;
  groupId?: string;
};

export default function PostImageButton({
  imageUri,
  imageWidth,
  imageHeight,
  thumbnailUri,
  caption,
  action,
  groupId,
}: PostImageButtonProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);
  const [postInProgress, setPostInProgress] = useState<boolean>(false);
  const [insertPost, { loading: insertPostLoading, error: insertPostError }] =
    useMutation(insertPostMutation);

  const postingStarted = async () => {
    // The following delay is to make sure the bottom sheet is closed
    // before the spinner shows up
    await delay(1000);
    setPostInProgress(true);
  };

  const postingEnded = (groupId: string, postId: string) => {
    setPostInProgress(false);
    const notification: PostNotification = {
      type: 'post',
      groupId: groupId,
      postId: postId,
      senderId: userId,
      imageUrl: imageUri,
    };
    createPostNotification(notification).then(() => {
      navigation.dispatch(StackActions.popToTop());
      navigation.navigate(SCREEN_NAME_GROUP, { groupId: groupId });
    });
  };

  const submitPost = (groupId: string) => {
    postingStarted();

    const firebaseImagePath = `/groups/${groupId}/users/${userId}/images/${uuidv4()}.${IMAGE_FORMAT}`;
    const firebaseThumbnailPath = `/groups/${groupId}/users/${userId}/thumbnails/${uuidv4()}.${IMAGE_FORMAT}`;
    const imgReference = storage().ref(firebaseImagePath);
    const thumbnailReference = storage().ref(firebaseThumbnailPath);
    imgReference.putFile(imageUri).then(() => {
      thumbnailReference.putFile(thumbnailUri).then(() => {
        insertPost({
          variables: {
            caption: caption,
            type: 'Photo',
            points_gained: 0,
            user_id: userId,
            group_id: groupId,
            img_url: firebaseImagePath,
            thumbnail_url: firebaseThumbnailPath,
            original_img_url: firebaseImagePath,
            image_metadata: {
              width: imageWidth,
              height: imageHeight,
            },
          },
        })
          .then((result) => {
            const postId =
              result.data.insert_user_post_edge.returning[0].post_id;
            postingEnded(groupId, postId);
          })
          .finally(async () => {
            let source = '';
            switch (action) {
              case ActionType.CREATE_POST:
                source = 'camera';
                break;
              case ActionType.CREATE_POST_FROM_GROUP:
                source = 'group';
                break;
              default:
                source = 'unknown';
            }
            // LOG EVENT
            await analytics().logEvent('button', {
              user_id: userId,
              button: 'create_post',
              source: source,
              target_group_id: groupId,
            });
          });
      });
    });
  };

  if (insertPostError) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  if (action === ActionType.CREATE_POST_FROM_GROUP && groupId) {
    return (
      <View style={styles.container}>
        <PostToCurrentGroupButton
          submitPost={submitPost}
          action={action}
          groupId={groupId}
        />
        <InProgressSpinner inProgress={postInProgress || insertPostLoading} />
      </View>
    );
  } else if (action === ActionType.CREATE_POST) {
    return (
      <View style={styles.container}>
        <PostToGroupButton submitPost={submitPost} />
        <InProgressSpinner inProgress={postInProgress || insertPostLoading} />
      </View>
    );
  } else {
    // SHOULD NOT HAPPEN
    return <View />;
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

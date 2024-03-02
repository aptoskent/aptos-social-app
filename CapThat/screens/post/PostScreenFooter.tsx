import { useCallback, useContext, useState } from 'react';
import { StyleSheet, View, TextInput, Keyboard, Text } from 'react-native';
import LikeOrCommentButton from './LikeOrCommentButton';
import { AuthContext } from '../../auth/AuthContext';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';
import { FooterContainer } from '../../components/footer_screen/FooterContainer';
import analytics from '@react-native-firebase/analytics';
import { useQuery } from '@apollo/client';
import { getMembersForGroupIdQuery } from '../../gql/getGroupQuery';
import {
  createCommentNotification,
  CommentNotification,
} from '../../notification/sendNotification';
import SupportingButton from '../../components/button/SupportingButton';

import tw from '../../tailwind';
import GroupInviteModal from 'CapThat/components/modal/GroupInviteModal';

export const BORDER_COLOR = '#777777';
export const FOOTER_HEIGHT = 90;

type PostScreenFooterProps = {
  postId: string;
  groupId: string;
  likedByMe: boolean;
  likedByMeReactionId: string;
  insertComment: any;
  deleteReaction: any;
  insertReaction: any;
  source: string;
};

export default function PostScreenFooter({
  postId,
  groupId,
  likedByMe,
  likedByMeReactionId,
  insertComment,
  deleteReaction,
  insertReaction,
  source,
}: PostScreenFooterProps) {
  const { userId } = useContext(AuthContext);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');

  useQuery(getMembersForGroupIdQuery, {
    variables: {
      group_id: groupId,
    },
    onCompleted: (data) => {
      const currentGroup = data.group[0];
      const members = currentGroup?.group_user_edges?.map(
        (edge: any) => edge.user.id,
      );
      if (members.includes(userId)) {
        setIsFooterVisible(true);
      }
    },
  });

  const onChangeComment = (updatedComment: string) => {
    setComment(updatedComment);
  };

  const onShowRequestModal = useCallback(() => {
    setShowJoinGroupModal(true);
  }, []);

  const sendComment = () => {
    if (comment.length === 0) {
      return;
    }
    insertComment({
      variables: {
        content: comment,
        post_id: postId,
        from_user_id: userId,
      },
    }).finally(async () => {
      setComment('');
      Keyboard.dismiss();

      const notification: CommentNotification = {
        senderId: userId,
        type: 'comment',
        postId: postId,
        imageUrl: '',
        comment: comment,
      };
      await createCommentNotification(notification);

      // LOG EVENT
      await analytics().logEvent('button', {
        user_id: userId,
        button: 'confirm_comment',
        source: source,
        target_post_id: postId,
        target_group_id: groupId,
      });
    });
  };

  const toggleLikePost = () => {
    if (likedByMe) {
      // unlike post
      deleteReaction({
        variables: {
          reaction_id: likedByMeReactionId,
        },
      });
    } else {
      // like post
      insertReaction().finally(async () => {
        // LOG EVENT
        await analytics().logEvent('button', {
          user_id: userId,
          button: 'heart',
          source: source,
          target_post_id: postId,
          target_group_id: groupId,
        });
      });
    }
  };

  if (isFooterVisible) {
    return (
      <FooterContainer>
        <View style={styles.contentContainer}>
          <TextInput
            style={styles.commentBox}
            onChangeText={onChangeComment}
            value={comment}
            placeholder="Add Comment"
            placeholderTextColor={BORDER_COLOR}
            keyboardAppearance="dark"
          />
          <LikeOrCommentButton
            isLiked={likedByMe}
            onPressLike={toggleLikePost}
            isCommentActivated={comment.length > 0}
            onPressSendComment={sendComment}
          />
        </View>
      </FooterContainer>
    );
  }

  return (
    <View style={tw('items-center mt-6 justify-center gap-1')}>
      <Text style={tw('ft-global-inactive')}>
        Only group members can comment + like.
      </Text>
      <SupportingButton title="Join" onPress={onShowRequestModal} noPadding />
      {showJoinGroupModal ? <GroupInviteModal groupId={groupId} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginVertical: 12,
  },
  commentBox: {
    flex: 1,
    borderRadius: 16,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    paddingVertical: 17,
    paddingHorizontal: 12,
    color: 'white',
  },
});

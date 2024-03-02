import { useContext, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Heading2 from '../../components/text/Heading2';
import { HexagonImageType } from '../../components/profile_picture_mascot/HexagonImage';
import {
  SCREEN_NAME_GROUP,
  SCREEN_NAME_MY_PROFILE,
  SCREEN_NAME_POST,
  SCREEN_NAME_USER_PROFILE,
} from '../../nav/constants';
import { Post } from '../../components/gallery/dataHelper';
import { convertTimestampToUserTime } from '../../utils';
import { PostMoreOptionButton } from '../post/PostMoreOptionButton';
import GlobalText from '../../components/text/GlobalText';
import GroupMascot from '../../components/profile_picture_mascot/GroupMascot';
import { AuthContext } from '../../auth/AuthContext';
import SupportingButton from '../../components/button/SupportingButton';
import { useGetIsMyGroup } from '../../hooks/useGetIsMyGroup';
import Icon from 'react-native-remix-icon';
import {
  UserProfilePictureWithFallback,
  UserPfpSize,
} from '../../components/profile_picture/UserProfilePicture';
import GroupInviteModal from 'CapThat/components/modal/GroupInviteModal';
import { insertReactionMutation } from '../../gql/insertReactionMutation';
import { useMutation } from '@apollo/client';

import tw from '../../tailwind.js';
import { useDownloadUrlForImage } from '../../hooks/useDownloadUrlForImage';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import DoubleTapHeartImage from 'CapThat/components/MultiTapTouchable/DoubleTapHeartImage';
// utils
import { getPhotoRatio } from 'CapThat/utils/imageUtils';

type FeedScreenWidgetProps = {
  post: Post;
};

export default function FeedScreenWidget({ post }: FeedScreenWidgetProps) {
  const navigation = useTypedNavigation();
  const { userId } = useContext(AuthContext);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);
  const [likesCount, setLikesCount] = useState(
    post?.reactions_aggregate?.aggregate?.count,
  );
  const [likedByMe, setLikedByMe] = useState(
    post?.reactions?.some((reaction) => userId === reaction?.from_user?.id),
  );
  const isFromMyGroup = useGetIsMyGroup(userId, post.group.id);
  // todo: find better more consistent solution than overriding group state
  const [isMyGroupOverride, setIsMyGroupOverride] = useState(isFromMyGroup);
  const commentsCount = post?.comments_aggregate?.aggregate.count;

  useEffect(() => {
    setIsMyGroupOverride(isFromMyGroup);
  }, [isFromMyGroup]);

  const { downloadUrl: imageUri } = useDownloadUrlForImage(
    post.photo_post.image.img_url,
  );

  const [insertReaction] = useMutation(insertReactionMutation, {
    variables: {
      post_id: post.id,
      from_user_id: userId,
      reaction_type: 'Like',
    },
  });

  const goToPostScreen = () => {
    navigation.navigate(SCREEN_NAME_POST, {
      postId: post.id,
      source: 'discover',
    });
  };

  const goToGroupScreen = () => {
    navigation.navigate(SCREEN_NAME_GROUP, {
      groupId: post.group.id,
    });
  };

  const goToProfileScreen = () => {
    if (userId === post.photo_post.created_by_user.id) {
      navigation.navigate(SCREEN_NAME_MY_PROFILE);
    } else {
      navigation.navigate(SCREEN_NAME_USER_PROFILE, {
        userId: post.photo_post.created_by_user.id,
        username: post.photo_post.created_by_user.username,
      });
    }
  };

  const likePost = () => {
    if (!likedByMe) {
      setLikesCount(likesCount + 1);
      setLikedByMe(true);
      insertReaction();
    }
  };

  const openRequestToJoinModal = () => {
    setShowJoinGroupModal(true);
  };

  const renderCommentLikeCount = () => {
    if (!commentsCount && !likesCount) {
      return null;
    }

    return (
      <View
        style={tw(
          'absolute bottom-4 flex-row p-4 items-center rounded-3xl bg-modal-background',
        )}
      >
        {!!commentsCount && (
          <View style={tw('flex-row items-center')}>
            <Icon name={'chat-smile-2-fill'} color="white" size={13.3} />
            <Text style={tw('text-white text-sm ml-1.5 font-clash_semi_bold')}>
              {commentsCount} {commentsCount > 1 ? 'comments' : 'comment'}
            </Text>
          </View>
        )}
        {!!likesCount && (
          <View style={tw('flex-row items-center', !!commentsCount && 'ml-3')}>
            <Icon name={'heart-3-fill'} color="white" size={13.3} />
            <Text style={tw('text-white text-sm ml-1.5 font-clash_semi_bold')}>
              {likesCount} {likesCount > 1 ? 'likes' : 'like'}
            </Text>
          </View>
        )}
      </View>
    );
  };
  return (
    <View style={tw('flex-1 bg-background rounded-t-2xl m-4')}>
      <View style={tw('flex-row mb-3 justify-between items-center')}>
        <TouchableOpacity
          style={tw('flex-row gap-3 items-center')}
          onPress={goToGroupScreen}
        >
          <GroupMascot
            isTestGroup={post.group.is_test_group}
            type={HexagonImageType.THUMBNAIL}
            groupPfpSerialNumber={post.group.profile_picture_serial_number}
            groupTestPfpSerialNumber={
              post.group.test_group_profile_picture_serial_number
            }
          />
          <View>
            <View style={tw('flex-row items-center gap-2"')}>
              <Heading2>{post.group.name}</Heading2>
              {!isMyGroupOverride && (
                <>
                  <Heading2>{`·`}</Heading2>
                  <SupportingButton
                    title="Join"
                    onPress={openRequestToJoinModal}
                    noPadding
                  />
                  {showJoinGroupModal ? (
                    <GroupInviteModal
                      groupId={post.group.id}
                      setIsMyGroupOverride={setIsMyGroupOverride}
                    />
                  ) : null}
                </>
              )}
            </View>
            <GlobalText inactive>
              {convertTimestampToUserTime(post.created_at)}
            </GlobalText>
          </View>
        </TouchableOpacity>
        <PostMoreOptionButton post={post} />
      </View>
      {imageUri && (
        <View style={tw('items-center')}>
          <DoubleTapHeartImage
            imgUri={imageUri}
            aspectRatio={getPhotoRatio(post.photo_post.image)}
            onSingleTap={goToPostScreen}
            onDoubleTapSecondaryAction={likePost}
          />
          {renderCommentLikeCount()}
        </View>
      )}
      <View style={tw('flex-row mt-3')}>
        <TouchableOpacity
          style={tw('flex-row mr-2')}
          onPress={goToProfileScreen}
        >
          <UserProfilePictureWithFallback
            userData={post?.photo_post?.created_by_user}
            size={UserPfpSize.SMALL}
          />
        </TouchableOpacity>
        <Text
          numberOfLines={isTruncated ? 2 : 0}
          style={tw('text-white text-sm flex-shrink font-clash_regular')}
        >
          <Text style={tw('font-clash_bold')} onPress={goToProfileScreen}>
            {post?.photo_post?.created_by_user?.username}
            {'  '}
          </Text>
          <Text onPress={() => setIsTruncated(!isTruncated)}>
            {post?.photo_post?.caption}
          </Text>
        </Text>
      </View>
    </View>
  );
}

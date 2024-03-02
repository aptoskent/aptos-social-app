import { View } from 'react-native';
import PostScreenHeader from './PostScreenHeader';
import PostScreenView from './PostScreenView';
import PostScreenFooter from './PostScreenFooter';
import { useContext, useState } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import { getReactionCountAndFirstReactorByPostQuery } from '../../gql/getReactionsByPostQuery';
import { getReactionByPostAndUserQuery } from '../../gql/getReactionByPostAndUserQuery';
import { useMutation, useQuery } from '@apollo/client';
import { insertCommentMutation } from '../../gql/insertCommentMutation';
import { deleteReactionMutation } from '../../gql/deleteReactionMutation';
import { insertReactionMutation } from '../../gql/insertReactionMutation';
import { getCommentsByPostQuery } from '../../gql/getCommentsByPostQuery';
import { getPostQuery } from '../../gql/getPostQuery';
import { Post } from '../../components/gallery/dataHelper';
import { ScreenWithFooter } from '../../components/footer_screen/ScreenWithFooter';
import ErrorView from '../../components/error_state/ErrorView';
import { TypedToast } from '../../components/TypedToast';
import { ToastType } from '../../components/TypedToast';

// TODO: add TS types https://reactnavigation.org/docs/typescript/
export default function PostScreen({ route }) {
  const { postId, source } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const { userId } = useContext(AuthContext);
  const [likedByMe, setLikedByMe] = useState<boolean>(false);
  // reaction id of the like reaction by myself if available
  const [likedByMeReactionId, setLikedByMeReactionId] = useState<string>('');

  const { loading: getPostLoading, error: getPostError } = useQuery(
    getPostQuery,
    {
      variables: {
        post_id: postId,
      },
      onCompleted: (data) => {
        if (data.post.length === 0) {
          <ErrorView error={new Error('no post found')} />;
        }
        setPost(data.post[0]);
      },
    },
  );

  const {
    loading: getReactionByPostAndUserLoading,
    error: getReactionByPostAndUserError,
  } = useQuery(getReactionByPostAndUserQuery, {
    variables: {
      post_id: postId,
      user_id: userId,
    },
    onCompleted: (data) => {
      if (data.post.length === 0) {
        TypedToast.show({ type: ToastType.ERROR });
      }
      if (
        data.post[0].reactions.length === 1 &&
        data.post[0].reactions[0].type === 'Like'
      ) {
        setLikedByMe(true);
        setLikedByMeReactionId(data.post[0].reactions[0].id);
      } else {
        setLikedByMe(false);
        setLikedByMeReactionId('');
      }
    },
  });

  const [
    insertComment,
    { loading: insertCommentLoading, error: insertCommentError },
  ] = useMutation(insertCommentMutation, {
    variables: {
      content: '', // default value, real value set when insertComment is called
      post_id: postId,
      from_user_id: userId,
    },
    refetchQueries: [
      {
        query: getCommentsByPostQuery,
        variables: {
          post_id: postId,
        },
      },
      {
        query: getPostQuery,
        variables: {
          post_id: postId,
        },
      },
    ],
  });

  const [
    deleteReaction,
    { loading: deleteReactionLoading, error: deleteReactionError },
  ] = useMutation(deleteReactionMutation, {
    variables: {
      reaction_id: likedByMeReactionId,
    },
    refetchQueries: [
      {
        query: getReactionCountAndFirstReactorByPostQuery,
        variables: {
          post_id: postId,
        },
      },
      {
        query: getReactionByPostAndUserQuery,
        variables: {
          post_id: postId,
          user_id: userId,
        },
      },
    ],
  });

  const [
    insertReaction,
    { loading: insertReactionLoading, error: insertReactionError },
  ] = useMutation(insertReactionMutation, {
    variables: {
      post_id: postId,
      from_user_id: userId,
      reaction_type: 'Like',
    },
    refetchQueries: [
      {
        query: getReactionCountAndFirstReactorByPostQuery,
        variables: {
          post_id: postId,
        },
      },
      {
        query: getReactionByPostAndUserQuery,
        variables: {
          post_id: postId,
          user_id: userId,
        },
      },
    ],
  });

  if (
    getPostError ||
    getReactionByPostAndUserError ||
    insertCommentError ||
    deleteReactionError ||
    insertReactionError
  ) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  if (!post) {
    return <View />;
  }

  let showSpinner = false;
  if (
    getReactionByPostAndUserLoading ||
    getPostLoading ||
    insertCommentLoading ||
    deleteReactionLoading ||
    insertReactionLoading
  ) {
    showSpinner = true;
  }

  return (
    <ScreenWithFooter
      showSpinner={showSpinner}
      headerComponent={<PostScreenHeader post={post} />}
      contentComponent={<PostScreenView post={post} />}
      footerComponent={
        <PostScreenFooter
          postId={postId}
          groupId={post?.group_id}
          likedByMe={likedByMe}
          likedByMeReactionId={likedByMeReactionId}
          insertComment={insertComment}
          deleteReaction={deleteReaction}
          insertReaction={insertReaction}
          source={source}
        />
      }
    />
  );
}

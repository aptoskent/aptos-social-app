import { TouchableOpacity, Text } from 'react-native';
import { Post } from '../../components/gallery/dataHelper';
import { useQuery } from '@apollo/client';
import { getReactionCountAndFirstReactorByPostQuery } from '../../gql/getReactionsByPostQuery';
import InProgressSpinner from '../../components/InProgressSpinner';
import { SCREEN_NAME_POST_LIKE_LIST } from '../../nav/constants';
import GlobalText from '../../components/text/GlobalText';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import Icon from 'react-native-remix-icon';

import tw from '../../tailwind';
import { TypedToast } from '../../components/TypedToast';
import { ToastType } from '../../components/TypedToast';

type PostScreenReactions = {
  post: Post;
};

export default function PostScreenReactions({ post }: PostScreenReactions) {
  const navigation = useTypedNavigation();
  const goToPostLikeListScreen = () => {
    navigation.navigate(SCREEN_NAME_POST_LIKE_LIST, {
      postId: post.id,
    });
  };

  const {
    loading: getReactionsLoading,
    error: getReactionsError,
    data: getReactionsData,
  } = useQuery(getReactionCountAndFirstReactorByPostQuery, {
    variables: {
      post_id: post.id,
    },
  });

  if (getReactionsLoading) {
    return <InProgressSpinner inProgress={getReactionsLoading} />;
  }

  if (getReactionsError) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  const firstReactor = getReactionsData?.post?.[0]?.reactions?.[0]?.from_user;
  const reactionCount =
    getReactionsData?.post?.[0]?.reactions_aggregate?.aggregate?.count;

  if (!firstReactor || !reactionCount) {
    return null;
  }

  const renderOthersText = () => {
    const othersCount = reactionCount - 1;
    if (othersCount < 1) {
      return null;
    }

    return (
      <>
        and <Text style={tw('font-clash_semi_bold')}>{othersCount} others</Text>
      </>
    );
  };

  return (
    <TouchableOpacity
      style={tw('flex-row gap-1')}
      onPress={goToPostLikeListScreen}
    >
      <Icon name={'heart-3-fill'} size={16} color={'white'} />
      <GlobalText>
        Liked by{' '}
        <Text style={tw('font-clash_semi_bold')}>
          {firstReactor?.username}{' '}
        </Text>
        {renderOthersText()}
      </GlobalText>
    </TouchableOpacity>
  );
}

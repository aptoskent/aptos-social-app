import { View, TextInput } from 'react-native';
import { useState } from 'react';
import { BORDER_COLOR, footerStyles } from '../post/styles';
import FooterEditButton from '../../components/button/FooterEditButton';
import { Post } from '../../components/gallery/dataHelper';
import { updatePhotoPostCaptionMutation } from '../../gql/updatePhotoPostCaptionMutation';
import { useMutation } from '@apollo/client';
import InProgressSpinner from '../../components/InProgressSpinner';
import { getPostQuery } from '../../gql/getPostQuery';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';
import { TypedToast } from 'CapThat/components/TypedToast';
import { ToastType } from 'CapThat/components/TypedToast';

type EditPostScreenFooterProps = {
  post: Post;
};

export default function EditPostScreenFooter({
  post,
}: EditPostScreenFooterProps) {
  const navigation = useTypedNavigation();
  const originalCaption = post.photo_post.caption;
  const [updatedCaption, setUpdatedCaption] = useState<string>(originalCaption);
  const [
    updatePhotoPostCaption,
    {
      loading: updatePhotoPostCaptionLoading,
      error: updatePhotoPostCaptionError,
    },
  ] = useMutation(updatePhotoPostCaptionMutation, {
    variables: {
      photo_post_id: post.photo_post.id,
      updated_caption: updatedCaption,
    },
    refetchQueries: [
      {
        query: getPostQuery,
        variables: {
          post_id: post.id,
        },
      },
    ],
  });

  const onChangeText = (text: string) => {
    setUpdatedCaption(text);
  };

  const saveEdit = () => {
    if (updatedCaption === originalCaption) {
      return;
    }

    updatePhotoPostCaption().then(() => {
      navigation.goBack();
    });
  };

  if (updatePhotoPostCaptionLoading) {
    return <InProgressSpinner inProgress={updatePhotoPostCaptionLoading} />;
  }

  if (updatePhotoPostCaptionError) {
    TypedToast.show({ type: ToastType.ERROR });
  }

  return (
    <View style={footerStyles.footerBar}>
      <View style={footerStyles.container}>
        <TextInput
          style={footerStyles.commentBox}
          onChangeText={onChangeText}
          value={updatedCaption}
          placeholder="Add Comment"
          placeholderTextColor={BORDER_COLOR}
          keyboardAppearance="dark"
        />
        <FooterEditButton
          isActivated={updatedCaption !== originalCaption}
          onPress={saveEdit}
        />
      </View>
    </View>
  );
}

import { StyleSheet, TextInput, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../../constants';
import { useState } from 'react';
import PostButton from './post/PostButton';
import { ActionType } from '../ActionType';
import { FooterContainer } from '../../../components/footer_screen/FooterContainer';
import UploadProfileImageButton from './upload_profile_image/UploadProfileImageButton';

export const BORDER_COLOR = '#777777';

type PreviewPostScreenFooterProps = {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  thumbnailUri: string;
  action: ActionType;
  groupId?: string;
};
export default function PreviewPostScreenFooter({
  imageUri,
  imageWidth,
  imageHeight,
  thumbnailUri,
  action,
  groupId,
}: PreviewPostScreenFooterProps) {
  const [caption, setCaption] = useState<string>('');

  const onChangeCaption = (updatedCaption: string) => {
    setCaption(updatedCaption);
  };

  return (
    <FooterContainer>
      <View style={styles.container}>
        {action === ActionType.UPLOAD_PROFILE_PHOTO ? (
          <UploadProfileImageButton
            imageUri={thumbnailUri}
            thumbnailUri={thumbnailUri}
          />
        ) : (
          <>
            <TextInput
              style={styles.commentBox}
              onChangeText={onChangeCaption}
              value={caption}
              placeholder="Caption this..."
              placeholderTextColor={BORDER_COLOR}
              keyboardAppearance="dark"
            />
            <PostButton
              imageUri={imageUri}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              thumbnailUri={thumbnailUri}
              caption={caption}
              action={action}
              groupId={groupId}
            />
          </>
        )}
      </View>
    </FooterContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
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

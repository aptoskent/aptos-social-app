import { Keyboard, TouchableOpacity, View } from 'react-native';
import { TEXT_COLOR_PRIMARY } from '../../components/text/constants';
import Icon from 'react-native-remix-icon';
import PrimaryButton from '../../components/button/PrimaryButton';
import { postFooterButtonStyles } from '../../components/button/styles';
import { useEffect, useState } from 'react';

type LikeButtonProps = {
  isLiked: boolean;
  onPress: () => void;
};

export function LikeButton({ isLiked, onPress }: LikeButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon
        name={isLiked ? 'heart-3-fill' : 'heart-3-line'}
        size={32}
        color={TEXT_COLOR_PRIMARY}
      />
    </TouchableOpacity>
  );
}

type SendCommentButtonProps = {
  isActivated: boolean;
  onPress: () => void;
};

export function SendCommentButton({
  isActivated,
  onPress,
}: SendCommentButtonProps) {
  return (
    <PrimaryButton
      title=""
      iconName="send-plane-2-fill"
      disabled={!isActivated}
      onPress={onPress}
    />
  );
}

type LikeOrCommentButtonProps = {
  isLiked: boolean;
  onPressLike: () => void;
  isCommentActivated: boolean;
  onPressSendComment: () => void;
};

export default function LikeOrCommentButton({
  isLiked,
  onPressLike,
  isCommentActivated,
  onPressSendComment,
}: LikeOrCommentButtonProps) {
  const [onKeyboard, setOnKeyboard] = useState<boolean>(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setOnKeyboard(true);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setOnKeyboard(false);
      },
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  return (
    <View style={postFooterButtonStyles.container}>
      {onKeyboard ? (
        <SendCommentButton
          isActivated={isCommentActivated}
          onPress={onPressSendComment}
        />
      ) : (
        <LikeButton isLiked={isLiked} onPress={onPressLike} />
      )}
    </View>
  );
}

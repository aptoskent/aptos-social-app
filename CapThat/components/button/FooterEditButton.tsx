import { View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { postFooterButtonStyles } from './styles';

type FooterEditButtonProps = {
  isActivated: boolean;
  onPress: () => void;
};

// TODO: consolidate this component with LikeOrCommentButton
// they're both bottom right button for the footer
export default function FooterEditButton({
  isActivated,
  onPress,
}: FooterEditButtonProps) {
  return (
    <View style={postFooterButtonStyles.container}>
      <PrimaryButton
        title=""
        iconName="checkbox-circle-fill"
        disabled={!isActivated}
        onPress={onPress}
      />
    </View>
  );
}

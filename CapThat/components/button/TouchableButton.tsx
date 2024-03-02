import { TouchableOpacity } from 'react-native';

const PADDING = 16;

type TouchableButtonProps = {
  children: React.ReactElement;
  onPress: () => void;
};

// This component is used to make the touchable area bigger
export default function TouchableButton({
  children,
  onPress,
}: TouchableButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{ top: PADDING, bottom: PADDING, left: PADDING, right: PADDING }}
    >
      {children}
    </TouchableOpacity>
  );
}

import { Text } from 'react-native';
import { TEXT_COLOR_SECONDARY, TEXT_COLOR_TERTIARY } from './constants';

const FONT_SIZE = 12;

type SupportingText2Props = {
  secondary?: boolean;
  children: React.ReactNode;
};

export default function SupportingText2({
  secondary,
  children,
}: SupportingText2Props) {
  return (
    <Text
      style={{
        fontFamily: 'clash-grotesk-semibold',
        color: secondary ? TEXT_COLOR_TERTIARY : TEXT_COLOR_SECONDARY,
        fontSize: FONT_SIZE,
      }}
    >
      {children}
    </Text>
  );
}

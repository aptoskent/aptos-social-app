import { Text } from 'react-native';
import { TEXT_COLOR_PRIMARY } from './constants';

const FONT_SIZE = 12;

type SupportingTextProps = {
  maxWidth?: number;
  singleLine?: boolean;
  children: React.ReactNode;
};

export default function SupportingText({
  maxWidth,
  singleLine,
  children,
}: SupportingTextProps) {
  return (
    <Text
      style={{
        fontFamily: 'clash-grotesk-regular',
        color: TEXT_COLOR_PRIMARY,
        fontSize: FONT_SIZE,
        maxWidth: maxWidth,
      }}
      numberOfLines={singleLine ? 1 : undefined}
      ellipsizeMode="tail"
    >
      {children}
    </Text>
  );
}

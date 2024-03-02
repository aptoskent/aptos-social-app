import { Text } from 'react-native';
import { TEXT_COLOR_SECONDARY, TEXT_COLOR_TERTIARY } from './constants';

const FONT_SIZE = 14;

type Heading4Props = {
  inactive?: boolean;
  children: React.ReactNode;
};

/**
 * The smaller bold heading with blue and grey color.
 */
export default function Heading4({ inactive, children }: Heading4Props) {
  return (
    <Text
      style={{
        fontFamily: 'clash-grotesk-semibold',
        fontSize: FONT_SIZE,
        color: inactive ? TEXT_COLOR_SECONDARY : TEXT_COLOR_TERTIARY,
      }}
    >
      {children}
    </Text>
  );
}

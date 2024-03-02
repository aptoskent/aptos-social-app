import { Text } from 'react-native';
import { TEXT_COLOR_PRIMARY, TEXT_COLOR_SECONDARY } from './constants';

const FONT_SIZE = 14;

type GlobalTextProps = {
  inactive?: boolean;
  propStyles?: Object;
  children: React.ReactNode;
};

// TODO: create a general Text component that can be used for all text
export default function GlobalText({
  inactive,
  propStyles,
  children,
}: GlobalTextProps) {
  return (
    <Text
      style={[
        {
          fontFamily: 'clash-grotesk-regular',
          color: inactive ? TEXT_COLOR_SECONDARY : TEXT_COLOR_PRIMARY,
          fontSize: FONT_SIZE,
        },
        propStyles,
      ]}
    >
      {children}
    </Text>
  );
}

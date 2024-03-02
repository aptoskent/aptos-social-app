import { StyleSheet, Text } from 'react-native';
import { TEXT_COLOR_SECONDARY } from './constants';

const FONT_SIZE = 16;

type Heading3Props = {
  children: React.ReactNode;
};

/**
 * The smaller light heading with grey color.
 */
export default function Heading3({ children }: Heading3Props) {
  return <Text style={styles.heading3}>{children}</Text>;
}

const styles = StyleSheet.create({
  heading3: {
    fontFamily: 'clash-grotesk-regular',
    color: TEXT_COLOR_SECONDARY,
    fontSize: FONT_SIZE,
  },
});

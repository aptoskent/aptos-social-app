import { StyleSheet, Text } from 'react-native';
import { TEXT_COLOR_PRIMARY } from './constants';

const FONT_SIZE = 28;

type Heading1Props = {
  propStyles?: Object;
  children: React.ReactNode;
};

/**
 * The biggest bold heading with white color. You know it when you see it.
 */
export default function Heading1({ propStyles, children }: Heading1Props) {
  return <Text style={[styles.heading1, propStyles]}>{children}</Text>;
}

const styles = StyleSheet.create({
  heading1: {
    fontFamily: 'clash-display-bold',
    color: TEXT_COLOR_PRIMARY,
    fontSize: FONT_SIZE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

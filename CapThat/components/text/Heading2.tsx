import { StyleSheet, Text } from 'react-native';
import { TEXT_COLOR_PRIMARY } from './constants';
import { GLOBAL_WARNING_COLOR } from '../../constants';

const FONT_SIZE = 14;

type Heading2Props = {
  children: React.ReactNode;
  warning?: boolean;
  center?: boolean;
};

/**
 * The smaller bold heading with white color.
 */
export default function Heading2({ children, warning, center }: Heading2Props) {
  if (center) {
    return <Text style={styles.heading2Centered}>{children}</Text>;
  }
  return (
    <Text style={warning ? styles.heading2Warning : styles.heading2}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading2: {
    fontFamily: 'clash-display-bold',
    color: TEXT_COLOR_PRIMARY,
    fontSize: FONT_SIZE,
    fontWeight: 'bold',
  },
  heading2Warning: {
    fontFamily: 'clash-display-bold',
    color: GLOBAL_WARNING_COLOR,
    fontSize: FONT_SIZE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heading2Centered: {
    fontFamily: 'clash-display-bold',
    color: TEXT_COLOR_PRIMARY,
    fontSize: FONT_SIZE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

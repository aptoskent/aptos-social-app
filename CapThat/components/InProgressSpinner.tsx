import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

type InProgressSpinnerProps = {
  inProgress: boolean;
  text?: string;
};

// TODO: this is a temporary solution, we need to revisit the design
export default function InProgressSpinner({
  inProgress,
  text,
}: InProgressSpinnerProps) {
  return (
    <Spinner
      visible={inProgress}
      textContent={text}
      textStyle={styles.spinnerTextStyle}
    />
  );
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

import { Dimensions, StyleSheet } from 'react-native';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
  GLOBAL_TEXT_COLOR_PLACEHOLDER,
} from '../../constants';
import { TEXT_COLOR_PRIMARY } from '../../components/text/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
  scrollView: {
    marginTop: 20,
    alignSelf: 'center',
    flex: 1,
    width: '100%',
    paddingHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    gap: 12,
  },
  textContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 14,
    color: TEXT_COLOR_PRIMARY,
  },
  datePicker: {
    flex: 1,
    paddingVertical: 16,
    width: Dimensions.get('window').width - 2 * GLOBAL_SCREEN_MARGIN_HORIZONTAL,
  },
  dateInput: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: 'white',
    borderWidth: 1,
    padding: 8, // Also used to make it look nicer
    paddingLeft: 16,
    zIndex: 0,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  placeholderText: {
    color: GLOBAL_TEXT_COLOR_PLACEHOLDER,
  },
  dateText: {
    color: GLOBAL_TEXT_COLOR_PLACEHOLDER,
  },
  btnText: {
    color: '#007AFF',
  },
  datePickerCon: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: 'white',
    borderWidth: 1,
    padding: 8, // Also used to make it look nicer
    paddingLeft: 16,
    zIndex: 0,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: 'white',
    color: 'black',
  },
  buttonTitle: {
    color: TEXT_COLOR_PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

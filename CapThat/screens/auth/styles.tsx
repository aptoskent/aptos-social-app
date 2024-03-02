import { StyleSheet } from 'react-native';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_TEXT_COLOR_PLACEHOLDER,
} from '../../constants';
import { TEXT_COLOR_PRIMARY } from '../../components/text/constants';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    paddingHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    gap: 28,
    justifyContent: 'space-between',
    paddingBottom: 72,
    marginBottom: -72, // this is a hack to make the bottom of the screen not cut off
  },
  scrollView: {
    marginTop: 200,
    alignSelf: 'center',
    flex: 1,
    width: '100%',
  },
  title: {
    alignSelf: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    color: TEXT_COLOR_PRIMARY,
  },
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: 'center',
    margin: 30,
  },
  input: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 40,
    paddingLeft: 16,
  },
  inputText: {
    color: TEXT_COLOR_PRIMARY,
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
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: TEXT_COLOR_PRIMARY,
  },
  footerLink: {
    color: '#788eec',
    fontWeight: 'bold',
    fontSize: 16,
  },
  datePicker: {
    width: '100%',
    marginVertical: 40,
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
  pronounPicker: {
    marginVertical: 40,
  },
  placeholderText: {
    color: GLOBAL_TEXT_COLOR_PLACEHOLDER,
  },
  dateText: {
    color: 'white',
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
});

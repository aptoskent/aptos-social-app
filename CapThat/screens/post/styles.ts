import { StyleSheet } from 'react-native';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../constants';

export const BORDER_COLOR = '#777777';
const SAFE_AREA_PADDING = 50;

// TODO: (zihan) code refactor -- move to footer component
export const footerStyles = StyleSheet.create({
  footerBar: {
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    borderTopWidth: 0,
    bottom: -SAFE_AREA_PADDING,
    paddingBottom: SAFE_AREA_PADDING,
    height: 115, // TODO: this is a hack
  },
  container: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginTop: 12,
  },
  commentBox: {
    flex: 1,
    borderRadius: 16,
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    paddingVertical: 17,
    paddingHorizontal: 12,
    color: 'white',
  },
});

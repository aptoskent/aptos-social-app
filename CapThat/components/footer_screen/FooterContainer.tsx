import {
  StyleSheet,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { useEffect, useState } from 'react';
import { GLOBAL_BACKGROUND_COLOR } from '../../constants';

export const BORDER_COLOR = '#777777';
export const FOOTER_HEIGHT = 90;

type FooterContainerProps = {
  children: React.ReactElement;
};

export function FooterContainer({ children }: FooterContainerProps) {
  const [onKeyboard, setOnKeyboard] = useState<boolean>(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setOnKeyboard(true);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setOnKeyboard(false);
      },
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      >
        <View
          style={[styles.container, !onKeyboard && styles.containerKeyboardOff]}
        >
          {children}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowOpacity: 0.35,
    shadowRadius: 40,
  },
  containerKeyboardOff: {
    height: FOOTER_HEIGHT,
  },
});

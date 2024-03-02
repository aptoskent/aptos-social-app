import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_TEXT_COLOR_PLACEHOLDER,
} from '../constants';
import { TEXT_COLOR_PRIMARY } from './text/constants';
import SupportingText2 from './text/SupportingText2';

type PrimaryTextInputProps = {
  title: string;
  placeholder: string;
  onTextChange: (text: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  value: string;
  propsStyle?: object;
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad';
};
export default function PrimaryTextInput({
  title,
  placeholder,
  onTextChange,
  autoCapitalize,
  value,
  keyboardType,
  propsStyle,
}: PrimaryTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, propsStyle]}>
      <View style={styles.labelContainer}>
        <SupportingText2 secondary={isFocused}>{title}</SupportingText2>
      </View>
      <View
        style={[
          styles.inputContainer,
          { borderColor: isFocused ? '#6F83E9' : 'white' },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={GLOBAL_TEXT_COLOR_PLACEHOLDER}
          autoCapitalize={autoCapitalize}
          onChangeText={onTextChange}
          keyboardType={!!keyboardType ? keyboardType : 'default'}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // todo: container should have exact height to make component consistent
  container: {},
  title: {
    color: TEXT_COLOR_PRIMARY,
    fontSize: 12,
  },
  labelContainer: {
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    marginStart: 8,
    overflow: 'hidden',
    zIndex: 1,
    position: 'absolute',
    top: 3,
  },
  inputContainer: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    borderColor: 'white',
    borderWidth: 1,
    padding: 8, // Also used to make it look nicer
    paddingLeft: 16,
    zIndex: 0,
    // todo: Remove margin to make the component reusable
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  input: {
    color: TEXT_COLOR_PRIMARY,
    fontSize: 16,
    height: '100%',
  },
});

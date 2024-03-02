import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GLOBAL_BACKGROUND_COLOR } from '../constants';
import Icon from 'react-native-remix-icon';
import { TEXT_COLOR_PRIMARY, TEXT_COLOR_SECONDARY } from './text/constants';
import Clipboard from '@react-native-clipboard/clipboard';

const ERROR_COLOR = '#FF2842';
const DEFAULT_FONT_SIZE = 16;

type TextFieldProps = {
  title: string;
  value: string;
  onTextChange?: (text: string) => void;
  placeholder?: string;
  fontSize?: number;
  fontBold?: boolean;
  disableEditing?: boolean;
  hasCopyButton?: boolean;
  maxLength?: number;
};

// TODO: refine this component and replace PrimaryTextInput with this
export default function TextField({
  title,
  value,
  onTextChange,
  placeholder,
  fontSize = DEFAULT_FONT_SIZE,
  fontBold = false,
  disableEditing = false,
  hasCopyButton = false,
  maxLength,
}: TextFieldProps) {
  const handleCopy = () => {
    Clipboard.setString(value);
  };

  const showErrorMessage = !disableEditing && value.length >= (maxLength ?? 0);

  // TODO: add warning message when the text is too long
  // TODO: zihan-fonts fix fonts here but i'm too tired to do it now
  return (
    <View>
      <View style={styles.labelContainer}>
        <Text
          style={{
            fontFamily: 'clash-grotesk-regular',
            color: showErrorMessage ? ERROR_COLOR : TEXT_COLOR_SECONDARY,
            fontSize: 12,
          }}
        >
          {title}
        </Text>
      </View>
      <View
        style={{
          borderRadius: 16,
          borderColor: showErrorMessage ? ERROR_COLOR : TEXT_COLOR_SECONDARY,
          borderWidth: 1,
          padding: 16,
          zIndex: 0,
          marginTop: 12,
          gap: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextInput
          style={{
            flex: 1,
            color: TEXT_COLOR_PRIMARY,
            fontSize: fontSize,
            fontWeight: fontBold ? '700' : 'normal',
          }}
          value={value}
          editable={!disableEditing}
          onChangeText={disableEditing ? undefined : onTextChange}
          placeholder={placeholder}
          placeholderTextColor={TEXT_COLOR_SECONDARY}
          maxLength={maxLength}
        />
        {hasCopyButton && (
          <TouchableOpacity onPress={handleCopy}>
            <Icon name="file-copy-line" size="22" color="white" />
          </TouchableOpacity>
        )}
      </View>
      {showErrorMessage && (
        <Text
          style={styles.errorMessage}
        >{`Must be ${maxLength} characters or less.`}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  errorMessage: {
    marginTop: 8,
    marginLeft: 4,
    color: ERROR_COLOR,
    fontSize: 12,
  },
  labelContainer: {
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    paddingHorizontal: 8,
    marginStart: 12,
    zIndex: 1,
    position: 'absolute',
    top: 4,
  },
});

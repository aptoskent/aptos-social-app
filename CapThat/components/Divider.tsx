import React from 'react';
import { StyleSheet, View } from 'react-native';
import SupportingText2 from './text/SupportingText2';
import { TEXT_COLOR_SECONDARY } from './text/constants';

const GAP_WIDTH = 8;

type DividerProps = {
  text: string;
};
export default function Divider({ text }: DividerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.lineStart} />
      <SupportingText2>{text}</SupportingText2>
      <View style={styles.lineEnd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  lineStart: {
    width: GAP_WIDTH,
    height: 1,
    backgroundColor: TEXT_COLOR_SECONDARY,
    marginRight: GAP_WIDTH,
  },
  lineEnd: {
    flex: 1,
    height: 1,
    backgroundColor: TEXT_COLOR_SECONDARY,
    marginLeft: GAP_WIDTH,
  },
});

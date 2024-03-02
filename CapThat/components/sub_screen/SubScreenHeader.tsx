import { StyleSheet, View } from 'react-native';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../constants';
import Icon from 'react-native-remix-icon';
import React from 'react';
import Heading2 from '../../components/text/Heading2';
import { StackActions } from '@react-navigation/native';
import TouchableButton from '../button/TouchableButton';
import { useTypedNavigation } from '../../hooks/useTypedNavigation';

type SubScreenHeaderProps = {
  pageTitle: string;
};
export default function SubScreenHeader({ pageTitle }: SubScreenHeaderProps) {
  const navigation = useTypedNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  const exit = () => {
    navigation.dispatch(StackActions.popToTop());
  };

  return (
    <View style={styles.container}>
      <TouchableButton onPress={goBack}>
        <Icon name="arrow-left-s-line" size="22" color="white" />
      </TouchableButton>
      <Heading2>{pageTitle}</Heading2>
      <TouchableButton onPress={exit}>
        <Icon name="close-line" size="22" color="white" />
      </TouchableButton>
    </View>
  );
}

// TODO: modularize styles for all headers
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
  },
});

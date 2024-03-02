import React from 'react';
import { Dimensions, View, Image, StyleSheet } from 'react-native';
import HexagonImage, {
  EMPTY_STATE_SIZE,
  HexagonImageType,
} from '../profile_picture_mascot/HexagonImage';
//@ts-ignore
import placeholderImg from '../../assets/mascot_placeholder.png';
import Heading3 from '../text/Heading3';
import Icon from 'react-native-remix-icon';
import { TEXT_COLOR_SECONDARY } from '../text/constants';
import { ProfileScreenType } from '../main_screen/ProfileScreenType';

const ICON_SIZE = 28;

function getIconName(type: ProfileScreenType) {
  switch (type) {
    case ProfileScreenType.USER:
      return 'settings-line';
    case ProfileScreenType.GROUP:
      return 'pantone-line';
  }
}

function getText(type: ProfileScreenType) {
  switch (type) {
    case ProfileScreenType.USER:
      return 'Not part of any groups yet.';
    case ProfileScreenType.GROUP:
      return 'No posts yet.';
  }
}

function getHeight(type: ProfileScreenType) {
  // 480 or 560 is a hard code rough number that represents the height of the header and the tab bar
  switch (type) {
    case ProfileScreenType.USER:
      return Dimensions.get('window').height - 480;
    case ProfileScreenType.GROUP:
      return Dimensions.get('window').height - 560;
  }
}

type EmptyStateViewProps = {
  type: ProfileScreenType;
};

export default function EmptyStateView({ type }: EmptyStateViewProps) {
  const placeholderImgUri = Image.resolveAssetSource(placeholderImg).uri;

  return (
    <View
      style={{
        height: getHeight(type),
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <View>
        <HexagonImage
          uri={placeholderImgUri}
          type={HexagonImageType.EMPTY_STATE}
        />
        <View style={styles.iconContainer}>
          <Icon
            name={getIconName(type)}
            size={ICON_SIZE}
            color={TEXT_COLOR_SECONDARY}
          />
        </View>
      </View>
      <Heading3>{getText(type)}</Heading3>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: (EMPTY_STATE_SIZE - ICON_SIZE) / 2,
    left: (EMPTY_STATE_SIZE - ICON_SIZE) / 2,
  },
});

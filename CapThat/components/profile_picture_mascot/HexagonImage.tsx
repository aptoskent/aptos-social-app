import { HexagonView } from 'react-native-hexagon';
import { View } from 'react-native';
import { Image } from 'react-native';
import Icon from 'react-native-remix-icon';
//@ts-ignore
import placeholderImg from '../../assets/mascot_placeholder.png';
import { TEXT_COLOR_SECONDARY } from '../text/constants';

const CORNER_RADIUS = 12;
const BORDER_COLOR = '#DDE8E8';
const EMPTY_STATE_BORDER_COLOR = TEXT_COLOR_SECONDARY;

const BORDER_SIZE_SMALL = 1;
const BORDER_SIZE_MEDIUM = 2;
const BORDER_SIZE_LARGE = 4;

const FULL_SIZE = 176;
const PRIMARY_SIZE = 100;
const GROUP_PROFILE_SIZE = PRIMARY_SIZE + BORDER_SIZE_LARGE * 2;
export const SECONDARY_SIZE = 56;
const THUMBNAIL_SIZE = 36;
export const LISTVIEW_SIZE = 64;
export const EMPTY_STATE_SIZE = 92;

const LOCK_ICON_SIZE = 32;

export enum HexagonImageType {
  GROUP_PROFILE = 'GROUP_PROFILE',
  FULL = 'FULL',
  PRIMARY = 'PRIMARY',
  PRIMARY_WITH_LOCK = 'PRIMARY_WITH_LOCK',
  SECONDARY = 'SECONDARY',
  THUMBNAIL = 'THUMBNAIL',
  LISTVIEW = 'LISTVIEW',
  EMPTY_STATE = 'EMPTY_STATE',
}

function getBorderWidth(type: HexagonImageType) {
  switch (type) {
    case HexagonImageType.GROUP_PROFILE:
    case HexagonImageType.PRIMARY:
    case HexagonImageType.PRIMARY_WITH_LOCK:
    case HexagonImageType.FULL:
      return 0;
    case HexagonImageType.SECONDARY:
    case HexagonImageType.THUMBNAIL:
    case HexagonImageType.LISTVIEW:
      return BORDER_SIZE_SMALL;
    case HexagonImageType.EMPTY_STATE:
      return BORDER_SIZE_LARGE;
  }
}

function getHexagonSize(type: HexagonImageType) {
  switch (type) {
    case HexagonImageType.GROUP_PROFILE:
      return GROUP_PROFILE_SIZE;
    case HexagonImageType.FULL:
      return FULL_SIZE;
    case HexagonImageType.PRIMARY:
    case HexagonImageType.PRIMARY_WITH_LOCK:
      return PRIMARY_SIZE;
    case HexagonImageType.SECONDARY:
      return SECONDARY_SIZE;
    case HexagonImageType.THUMBNAIL:
      return THUMBNAIL_SIZE;
    case HexagonImageType.LISTVIEW:
      return LISTVIEW_SIZE;
    case HexagonImageType.EMPTY_STATE:
      return EMPTY_STATE_SIZE;
  }
}

function getBorderColor(type: HexagonImageType) {
  switch (type) {
    case HexagonImageType.GROUP_PROFILE:
    case HexagonImageType.FULL:
    case HexagonImageType.PRIMARY:
    case HexagonImageType.PRIMARY_WITH_LOCK:
    case HexagonImageType.SECONDARY:
    case HexagonImageType.THUMBNAIL:
    case HexagonImageType.LISTVIEW:
      return BORDER_COLOR;
    case HexagonImageType.EMPTY_STATE:
      return EMPTY_STATE_BORDER_COLOR;
  }
}

function getHexagonTopOffset(type: HexagonImageType) {
  switch (type) {
    case HexagonImageType.GROUP_PROFILE:
      return GROUP_PROFILE_SIZE / 2 - 40;
    case HexagonImageType.FULL:
    case HexagonImageType.PRIMARY:
    case HexagonImageType.PRIMARY_WITH_LOCK:
    case HexagonImageType.SECONDARY:
    case HexagonImageType.THUMBNAIL:
    case HexagonImageType.LISTVIEW:
    case HexagonImageType.EMPTY_STATE:
      return 0;
  }
}

type HexagonImageProps = {
  type: HexagonImageType;
  uri: string | undefined | null;
  loading?: boolean;
};

export default function HexagonImage({
  type,
  uri,
  loading,
}: HexagonImageProps) {
  const placeholderImgUri = Image.resolveAssetSource(placeholderImg).uri;
  const imgUri = loading ? '' : uri || placeholderImgUri;
  const size = getHexagonSize(type);
  const color = getBorderColor(type);
  const topOffset = getHexagonTopOffset(type);

  return (
    <View style={{ height: size }}>
      <HexagonView
        style={{
          height: size,
          width: size,
          top: topOffset,
        }}
        source={{
          uri: imgUri,
          borderColor: color,
          borderWidth: getBorderWidth(type),
          cornerRadius: CORNER_RADIUS,
        }}
      />
      {type === HexagonImageType.PRIMARY_WITH_LOCK && (
        <View
          style={{
            position: 'absolute',
            left: (PRIMARY_SIZE - LOCK_ICON_SIZE) / 2,
            top: (PRIMARY_SIZE - LOCK_ICON_SIZE) / 2,
            shadowColor: 'rgba(0, 0, 0, 1)',
            shadowOpacity: 0.8,
            shadowRadius: 16,
            elevation: 4, // Needed for Android
          }}
        >
          <Icon name="lock-fill" size={LOCK_ICON_SIZE} color="white" />
        </View>
      )}
    </View>
  );
}

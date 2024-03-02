import { Asset } from 'expo-media-library';
import { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Dimensions,
} from 'react-native';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../../constants';
import { SCREEN_NAME_CAMERA } from '../../../nav/constants';
import AlbumDropdownPicker from './AlbumDropdownPicker';
import CameraRollScreenHeader from './CameraRollScreenHeader';
import CameraRollScreenCurrentImages from './CameraRollScreenCurrentImages';
import RoundIconButton from '../../../components/button/RoundIconButton';
import { getImageRatioByActionType } from '../ratio';
import { ActionType } from '../ActionType';
import { useTypedNavigation } from '../../../hooks/useTypedNavigation';

const IMAGE_SIZE =
  Dimensions.get('window').width - 2 * GLOBAL_SCREEN_MARGIN_HORIZONTAL;

function CurrentImage({
  currentSelectedImage,
  actionType,
}: {
  currentSelectedImage?: Asset;
  actionType: ActionType;
}) {
  if (
    !currentSelectedImage ||
    !currentSelectedImage.width ||
    !currentSelectedImage.height
  ) {
    return null;
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          height: IMAGE_SIZE,
          aspectRatio: getImageRatioByActionType(
            currentSelectedImage.width,
            currentSelectedImage.height,
            actionType,
          ),
          borderRadius: 12,
          overflow: 'hidden',
          marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: currentSelectedImage?.uri || '' }}
          style={styles.currentImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
}

// TODO: add TS types https://reactnavigation.org/docs/typescript/
type CameraRollScreenViewProps = {
  route: any;
};

export default function CameraRollScreenView({
  route,
}: CameraRollScreenViewProps) {
  const navigation = useTypedNavigation();
  const [currentSelectedImage, setCurrentSelectedImage] = useState<Asset>();
  const [currentAlbumId, setCurrentAlbumId] = useState<string>();
  const action = route.params?.action;
  const groupId = route.params?.groupId;
  const onChangeCurrentSelectedImage = (image?: Asset) => {
    setCurrentSelectedImage(image);
  };

  const onChangeCurrentAlbumId = (albumId: string) => {
    setCurrentAlbumId(albumId);
  };

  const goToCamera = () => {
    navigation.navigate(SCREEN_NAME_CAMERA, {
      action: action,
      groupId: groupId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraRollScreenHeader
        imageUri={currentSelectedImage?.uri ?? ''}
        action={action}
        groupId={groupId}
      />
      <CurrentImage
        currentSelectedImage={currentSelectedImage}
        actionType={action}
      />
      <View style={styles.middlePartContainer}>
        <AlbumDropdownPicker onChangeCurrentAlbumId={onChangeCurrentAlbumId} />
        <RoundIconButton iconName="camera-switch-line" onPress={goToCamera} />
      </View>
      <CameraRollScreenCurrentImages
        currentAlbumId={currentAlbumId}
        onChangeSelectedImage={onChangeCurrentSelectedImage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
  currentImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  middlePartContainer: {
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginVertical: 8,
    flexDirection: 'row',
    zIndex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

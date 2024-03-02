import * as MediaLibrary from 'expo-media-library';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../../constants';
import { SCREEN_NAME_CAMERA_ROLL } from '../../../nav/constants';
import { useEffect, useState } from 'react';
import { ActionType } from '../ActionType';
import Heading4 from '../../../components/text/Heading4';
import { useTypedNavigation } from '../../../hooks/useTypedNavigation';

type CameraScreenFooterProps = {
  action: ActionType;
  groupId?: string;
};

export default function CameraScreenFooter({
  action,
  groupId,
}: CameraScreenFooterProps) {
  const navigation = useTypedNavigation();
  const [latestImage, setLatestImage] = useState<MediaLibrary.Asset | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const assets = await MediaLibrary.getAssetsAsync({
        first: 1,
        sortBy: MediaLibrary.SortBy.creationTime,
      });
      if (assets?.assets?.length > 0) {
        const asset = assets.assets[0];
        setLatestImage(asset);
      }
    })();
  }, []);

  const handleOpenCameraRoll = () => {
    navigation.navigate(SCREEN_NAME_CAMERA_ROLL, {
      action: action,
      groupId: groupId,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleOpenCameraRoll}
        style={styles.touchableContainer}
      >
        <Image source={{ uri: latestImage?.uri }} style={styles.thumbnail} />
        <Heading4>Upload from Camera Roll</Heading4>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginTop: 10,
  },
  touchableContainer: {
    alignItems: 'center',
    gap: 12,
    margin: 12,
  },
  thumbnail: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderColor: '#DDE8E8',
    borderWidth: 1,
  },
});

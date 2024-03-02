import * as MediaLibrary from 'expo-media-library';
import { FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Asset } from 'expo-media-library';
import { useEffect, useState } from 'react';

const PADDING = 1;

type CameraRollScreenCurrentImagesProps = {
  currentAlbumId: string | undefined;
  onChangeSelectedImage: (image?: Asset) => void;
};

export default function CameraRollScreenCurrentImages({
  currentAlbumId,
  onChangeSelectedImage,
}: CameraRollScreenCurrentImagesProps) {
  const [currentImages, setCurrentImages] = useState<Asset[]>([]);
  const [lastImageId, setLastImageId] = useState<string>();
  const [hasMoreImages, setHasMoreImages] = useState<boolean>(true);

  // TODO: @jianyi fix type
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onChangeSelectedImage(item)}
        style={styles.item}
      >
        <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      </TouchableOpacity>
    );
  };

  const fetchImagesOnAlbumChange = async () => {
    if (currentAlbumId) {
      const assets = await MediaLibrary.getAssetsAsync({
        first: 25,
        mediaType: 'photo',
        album: currentAlbumId,
      });
      if (assets.assets.length === 0) {
        setHasMoreImages(false);
        // TODO: @jianyi set default image
        onChangeSelectedImage(undefined);
        setLastImageId(undefined);
        setCurrentImages([]);
      } else {
        setHasMoreImages(true);
        onChangeSelectedImage(assets.assets[0]);
        setLastImageId(assets.assets[assets.assets.length - 1].id);
        setCurrentImages(assets.assets);
      }
    }
  };

  const fetchMoreImagesOnEndReached = async () => {
    if (currentAlbumId && hasMoreImages) {
      const assets = await MediaLibrary.getAssetsAsync({
        first: 25,
        mediaType: 'photo',
        album: currentAlbumId,
        after: lastImageId,
      });
      if (assets.assets.length === 0) {
        setHasMoreImages(false);
      } else {
        setLastImageId(assets.assets[assets.assets.length - 1].id);
        setCurrentImages((prevImages) => [...prevImages, ...assets.assets]);
      }
    }
  };

  useEffect(() => {
    fetchImagesOnAlbumChange();
  }, [currentAlbumId]);

  return (
    <FlatList
      style={styles.flatList}
      data={currentImages}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={4}
      contentContainerStyle={styles.flatListContainer}
      onEndReached={fetchMoreImagesOnEndReached}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  flatListContainer: {
    padding: -PADDING,
  },
  item: {
    padding: PADDING,
    width: '25%',
    height: '25%',
    aspectRatio: 1,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

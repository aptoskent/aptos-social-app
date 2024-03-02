import { Dimensions, View, Image } from 'react-native';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../constants';
import { PostImage } from '../../components/gallery/dataHelper';
import { useDownloadUrlForImage } from '../../hooks/useDownloadUrlForImage';

type PostScreenImageProps = {
  image: PostImage;
};

export function getPhotoRatio(image: PostImage) {
  // TODO: @jianyi width and height should always be present, think about what to do if they are not
  if (!('metadata' in image)) {
    return 1;
  }

  if (!('width' in image.metadata) || !('height' in image.metadata)) {
    return 1;
  }

  return image.metadata.height / image.metadata.width;
}

// TODO: (jianyi) add spinner when loading image
export default function PostScreenImage({ image }: PostScreenImageProps) {
  const {
    downloadUrl: imageUri,
    error,
    isLoading,
  } = useDownloadUrlForImage(image.img_url);

  const photoWidth =
    Dimensions.get('window').width - 2 * GLOBAL_SCREEN_MARGIN_HORIZONTAL;
  const photoHeight = photoWidth * getPhotoRatio(image);

  return (
    <View style={{ marginBottom: 12 }}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            alignItems: 'center',
            width: photoWidth,
            height: photoHeight,
            backgroundColor: GLOBAL_BACKGROUND_COLOR,
            borderRadius: 8,
          }}
        />
      )}
    </View>
  );
}

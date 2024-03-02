import { View, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  GLOBAL_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../constants';
import { PostImage } from '../../components/gallery/dataHelper';
import { getPhotoRatio } from '../post/PostScreenImage';
import { useDownloadUrlForImage } from '../../hooks/useDownloadUrlForImage';

type EditPostScreenViewProps = {
  image: PostImage;
};

export default function EditPostScreenView({ image }: EditPostScreenViewProps) {
  const { downloadUrl: imageUri, error } = useDownloadUrlForImage(
    image.img_url,
  );

  const photoWidth =
    Dimensions.get('window').width - 2 * GLOBAL_SCREEN_MARGIN_HORIZONTAL;
  const photoHeight = photoWidth * getPhotoRatio(image);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={{
            alignItems: 'center',
            width: photoWidth,
            height: photoHeight,
            backgroundColor: 'white',
            borderRadius: 8,
          }}
        />
      </View>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
    borderTopStartRadius: 16,
    borderTopEndRadius: 16,
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginBottom: 65, // this is a hack to make the bottom of the screen not cut off
  },
  imageContainer: {
    alignItems: 'center',
  },
});

import { StyleSheet, View, Image } from 'react-native';
import PreviewPostScreenFooter from './PreviewPostScreenFooter';
import { useEffect, useState } from 'react';
import { manipulateAsync } from 'expo-image-manipulator';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import InProgressSpinner from '../../../components/InProgressSpinner';
import CameraScreenHeader from '../camera/CameraScreenHeader';
import RoundIconButton from '../../../components/button/RoundIconButton';
import { createAssetAsync } from 'expo-media-library';
import { ScreenWithFooter } from '../../../components/footer_screen/ScreenWithFooter';
import {
  IMAGE_FORMAT,
  IMAGE_QUALITY,
  THUMBNAIL_QUALITY,
  getCenterCropData,
  getImageRatioByActionType,
  getThumbnailSize,
  getUploadImageSize,
} from '../ratio';
import ErrorView from '../../../components/error_state/ErrorView';

type PreviewPostScreenProps = {
  navigation: any;
  route: any;
};

// TODO: add TS types https://reactnavigation.org/docs/typescript/
export default function PreviewPostScreen({
  navigation,
  route,
}: PreviewPostScreenProps) {
  const { imageUri: originalImageUri, action, groupId } = route.params;
  const [uploadImageUri, setUploadImageUri] = useState<string>('');
  const [uploadImageWidth, setUploadImageWidth] = useState<number>(100);
  const [uploadImageHeight, setUploadImageHeight] = useState<number>(100);
  const [thumbnailUri, setThumbnailUri] = useState<string>('');

  useEffect(() => {
    if (!originalImageUri) {
      return;
    }
    Image.getSize(
      originalImageUri,
      (width, height) => {
        const imageRatio = getImageRatioByActionType(width, height, action);
        manipulateAsync(originalImageUri, [
          { crop: getCenterCropData(width, height, imageRatio) },
        ]).then((croppedImage) => {
          const uploadImgSize = getUploadImageSize(
            croppedImage.width,
            croppedImage.height,
            imageRatio,
          );
          // Resize the image to smaller size when the image is too big
          ImageResizer.createResizedImage(
            croppedImage.uri,
            uploadImgSize.width,
            uploadImgSize.height,
            IMAGE_FORMAT,
            IMAGE_QUALITY,
          ).then((resizedImage) => {
            setUploadImageUri(resizedImage.path);
            setUploadImageWidth(uploadImgSize.width);
            setUploadImageHeight(uploadImgSize.height);
          });

          const thumbnailImgSize = getThumbnailSize(
            croppedImage.width,
            croppedImage.height,
            imageRatio,
          );
          // Resize the image to much smaller size as thumbnail
          ImageResizer.createResizedImage(
            croppedImage.uri,
            thumbnailImgSize.width,
            thumbnailImgSize.height,
            IMAGE_FORMAT,
            THUMBNAIL_QUALITY,
          ).then((resizedImage) => {
            // // For debugging: print the size of the image
            // const response = await fetch(resizedImage.uri);
            // const blob = await response.blob();
            // const fileSizeInBytes = blob.size;
            // const fileSizeInMB = fileSizeInBytes / 1024;
            // console.warn(`${fileSizeInMB} KB`);
            setThumbnailUri(resizedImage.path);
          });
        });
      },
      (error) => {
        console.error('Error fetching image dimensions:', error);
        return <ErrorView />;
      },
    );
  }, [originalImageUri]);

  const savePhoto = async () => {
    await createAssetAsync(originalImageUri);
  };

  if (
    !uploadImageUri ||
    !uploadImageWidth ||
    !uploadImageHeight ||
    !thumbnailUri
  ) {
    return <InProgressSpinner inProgress={true} />;
  }

  const imageComponent = (
    <View style={styles.contentContainer}>
      <View>
        <View
          style={{
            aspectRatio: uploadImageWidth / uploadImageHeight,
            borderRadius: 12,
            overflow: 'hidden',
            alignItems: 'center',
          }}
        >
          <Image
            source={{ uri: uploadImageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.icon}>
          <RoundIconButton iconName="download-2-line" onPress={savePhoto} />
        </View>
      </View>
    </View>
  );

  return (
    <ScreenWithFooter
      headerComponent={<CameraScreenHeader />}
      contentComponent={imageComponent}
      footerComponent={
        <PreviewPostScreenFooter
          imageUri={uploadImageUri}
          imageHeight={uploadImageHeight}
          imageWidth={uploadImageWidth}
          thumbnailUri={thumbnailUri}
          action={action}
          groupId={groupId}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    borderRadius: 12,
    width: '100%',
    height: '100%',
  },
  icon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});

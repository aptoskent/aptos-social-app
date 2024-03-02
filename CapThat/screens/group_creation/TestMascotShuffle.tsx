import { StyleSheet, View } from 'react-native';
import Divider from '../../components/Divider';
import HexagonImage, {
  HexagonImageType,
} from '../../components/profile_picture_mascot/HexagonImage';
import SecondaryButton from '../../components/button/SecondaryButton';
import { useState } from 'react';
import { MascotImage } from '../../components/gallery/dataHelper';
import { useQuery } from '@apollo/client';
import InProgressSpinner from '../../components/InProgressSpinner';
import { getMascotImagesReusableQuery } from '../../gql/getLastMascotImageReusableQuery';
import { useDownloadUrlForImage } from '../../hooks/useDownloadUrlForImage';
import ErrorView from '../../components/error_state/ErrorView';

type TestMascotProps = {
  selectedTestMascotImage?: MascotImage;
  onChangeSelectedTestMascotImage: (mascotImage: MascotImage) => void;
};

// TODO: modularize this component and the MascotShuffle component
export const TestMascotShuffle = ({
  selectedTestMascotImage,
  onChangeSelectedTestMascotImage,
}: TestMascotProps) => {
  const [randomMascotImages, setRandomMascotImages] = useState<MascotImage[]>(
    [],
  );
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const { loading, error } = useQuery(getMascotImagesReusableQuery, {
    variables: {},
    onCompleted: (result) => {
      const mascots = result.mascot_image_reusable;
      setRandomMascotImages(mascots);
      onChangeSelectedTestMascotImage(mascots[selectedIdx]);
    },
  });

  const {
    downloadUrl: imageUri,
    isLoading: downloading,
    error: imageError,
  } = useDownloadUrlForImage(selectedTestMascotImage?.img_url);

  const handleShuffle = () => {
    let nextIdx = selectedIdx;
    if (selectedIdx === randomMascotImages.length - 1) {
      nextIdx = 0;
    } else {
      nextIdx = nextIdx + 1;
    }
    setSelectedIdx(nextIdx);
    onChangeSelectedTestMascotImage(randomMascotImages[nextIdx]);
  };

  if (loading || downloading) {
    return <InProgressSpinner inProgress={loading || downloading} />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <View style={styles.collectibleSectionContainer}>
      <Divider text="Choose Collectible Mascot" />
      {imageUri && <HexagonImage type={HexagonImageType.FULL} uri={imageUri} />}
      <View style={{ marginVertical: 8 }}>
        <SecondaryButton
          title="Shuffle"
          iconName="shuffle-line"
          onPress={handleShuffle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  collectibleSectionContainer: {
    gap: 12,
    alignItems: 'center',
  },
});

import { StyleSheet, View } from 'react-native';
import Divider from '../../components/Divider';
import HexagonImage, {
  HexagonImageType,
} from '../../components/profile_picture_mascot/HexagonImage';
import SecondaryButton from '../../components/button/SecondaryButton';
import { useState } from 'react';
import { MascotImage } from '../../components/gallery/dataHelper';
import { useQuery } from '@apollo/client';
import { getMascotImagesUnusedRandomlyQuery } from '../../gql/getMascotImagesUnusedQuery';
import InProgressSpinner from '../../components/InProgressSpinner';
import { useDownloadUrlForImage } from '../../hooks/useDownloadUrlForImage';
import ErrorView from '../../components/error_state/ErrorView';

type MascotProps = {
  randomMascotImageUnusedId: number;
  selectedMascotImage?: MascotImage;
  onChangeSelectedMascotImage: (mascotImage: MascotImage) => void;
};

export const MascotShuffle = ({
  randomMascotImageUnusedId,
  selectedMascotImage,
  onChangeSelectedMascotImage,
}: MascotProps) => {
  const [randomMascotImagesUnused, setRandomMascotImagesUnused] = useState<
    MascotImage[]
  >([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const { loading, error } = useQuery(getMascotImagesUnusedRandomlyQuery, {
    variables: {
      random_id: randomMascotImageUnusedId,
    },
    onCompleted: (result) => {
      const unusedMascots = result.mascot_image_unused;
      setRandomMascotImagesUnused(unusedMascots);
      onChangeSelectedMascotImage(unusedMascots[selectedIdx]);
    },
  });

  const {
    downloadUrl: imageUri,
    isLoading: downloading,
    error: imageError,
  } = useDownloadUrlForImage(selectedMascotImage?.img_url);

  const handleShuffle = () => {
    let nextIdx = selectedIdx;
    if (selectedIdx === randomMascotImagesUnused.length - 1) {
      nextIdx = 0;
    } else {
      nextIdx = nextIdx + 1;
    }
    setSelectedIdx(nextIdx);
    onChangeSelectedMascotImage(randomMascotImagesUnused[nextIdx]);
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

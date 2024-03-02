import MasonryList from '@react-native-seoul/masonry-list';
import { Dimensions, StyleSheet, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from '../../constants';
import { Post } from './dataHelper';
import GalleryViewPhoto from './GalleryViewPhoto';

const PHOTO_GAP = 8;
const windowWidth = Dimensions.get('window').width;
const photoDisplayWidth =
  (windowWidth - GLOBAL_SCREEN_MARGIN_HORIZONTAL - 3 * PHOTO_GAP) / 3;

type MasonryGalleryViewProps = {
  posts: Post[];
  source: string;
};

export default function MasonryGalleryView({
  posts,
  source,
}: MasonryGalleryViewProps) {
  const renderPhoto = ({ item, i }: { item: Post; i: number }) => {
    return (
      <GalleryViewPhoto
        post={item}
        photoDisplayWidth={photoDisplayWidth}
        key={i}
        source={source}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MasonryList
        style={{ alignSelf: 'stretch' }}
        contentContainerStyle={{
          alignSelf: 'stretch',
        }}
        numColumns={3}
        data={posts}
        // @ts-ignore
        renderItem={renderPhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL / 2,
  },
});

import * as MediaLibrary from 'expo-media-library';
import DropDownPicker, { ValueType } from 'react-native-dropdown-picker';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GLOBAL_BACKGROUND_COLOR } from '../../../constants';
import Icon from 'react-native-remix-icon';

const DEFAULT_ALBUM_TITLE = 'Recents';

type Album = {
  label: string;
  value: ValueType;
  selected?: boolean;
};

type AlbumDropdownPickerProps = {
  onChangeCurrentAlbumId: (albumId: string) => void;
};

export default function AlbumDropdownPicker({
  onChangeCurrentAlbumId,
}: AlbumDropdownPickerProps) {
  const [openPicker, setOpenPicker] = useState(false);
  const [currentAlbumId, setCurrentAlbumId] = useState<string | null>(null);
  const [albumPickerItem, setAlbumPickerItem] = useState<Album[]>([]);

  const fetchAlbums = async () => {
    const albumList = await MediaLibrary.getAlbumsAsync({
      includeSmartAlbums: true,
    });

    const albums: Album[] = [];

    let defaultAlbumId = albumList[0].id;
    albumList.forEach((album) => {
      if (album.title === DEFAULT_ALBUM_TITLE) {
        defaultAlbumId = album.id;
        albums.push({
          label: album.title,
          value: album.id,
          selected: true,
        });
      } else {
        albums.push({ label: album.title, value: album.id });
      }
    });

    // NOTE: @jianyi if users update their existing albums
    // they need to reenter the album roll page so we can refetch all albums
    // i think this is ok? many apps i use need this hard reload to get new albums
    setCurrentAlbumId(defaultAlbumId);
    setAlbumPickerItem(albums);
  };

  // setup images and albums on mount (only run once when the screen is mounted)
  useEffect(() => {
    fetchAlbums();
  }, []);

  // TODO: @jianyi fix type
  const handleOnChangeValue = async (value) => {
    onChangeCurrentAlbumId(value);
  };

  return (
    <DropDownPicker
      open={openPicker}
      value={currentAlbumId}
      items={albumPickerItem}
      setValue={setCurrentAlbumId}
      setOpen={setOpenPicker}
      multiple={false}
      onChangeValue={handleOnChangeValue}
      listMode="SCROLLVIEW"
      scrollViewProps={{
        style: {
          backgroundColor: GLOBAL_BACKGROUND_COLOR,
        },
      }}
      showTickIcon={false}
      containerStyle={styles.containerStyle}
      style={styles.style}
      dropDownContainerStyle={styles.dropDownContainer}
      labelStyle={styles.label}
      listItemContainerStyle={styles.listItemContainer}
      listItemLabelStyle={styles.listItemLabel}
      selectedItemLabelStyle={styles.selectedItemLabel}
      ArrowUpIconComponent={() => (
        <Icon name={'arrow-up-s-line'} size={22} color="white" />
      )}
      ArrowDownIconComponent={() => (
        <Icon name={'arrow-down-s-line'} size={22} color="white" />
      )}
    />
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 0.5,
    left: -8,
  },
  style: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: 12,
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
  dropDownContainer: {
    borderRadius: 12,
    borderWidth: 0,
    zIndex: 1000,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItemContainer: {
    alignItems: 'center',
    backgroundColor: GLOBAL_BACKGROUND_COLOR,
  },
  listItemLabel: {
    color: 'white',
    fontSize: 16,
  },
  selectedItemLabel: {
    fontWeight: '700',
  },
});

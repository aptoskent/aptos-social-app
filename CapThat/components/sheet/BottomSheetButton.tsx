import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  GLOBAL_BOTTOM_SHEET_BACKGROUND_COLOR,
  GLOBAL_SCREEN_MARGIN_HORIZONTAL,
} from '../../constants';
import BottomSheet, {
  BottomSheetAction,
  CustomBottomSheet,
} from './BottomSheet';

const sheetWidth =
  Dimensions.get('window').width - 2 * GLOBAL_SCREEN_MARGIN_HORIZONTAL;
const sheetStyle = {
  container: {
    backgroundColor: GLOBAL_BOTTOM_SHEET_BACKGROUND_COLOR,
    borderRadius: 24,
    marginHorizontal: GLOBAL_SCREEN_MARGIN_HORIZONTAL,
    marginBottom: 24,
    width: sheetWidth,
    height: 'auto',
    paddingBottom: 20,
  },
  wrapper: {
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
};

type BottomSheetButtonProps = {
  buttonContentComponent: React.ReactElement;
  sheetTitle: string;
  sheetActions: BottomSheetAction[];
};

// TODO: add TS types https://reactnavigation.org/docs/typescript/
export default function BottomSheetButton({
  buttonContentComponent,
  sheetTitle,
  sheetActions,
}: BottomSheetButtonProps) {
  const bottomSheetRef = useRef<RBSheet>(null);

  const openSheet = () => {
    bottomSheetRef.current?.open();
  };

  return (
    <View>
      <TouchableOpacity onPress={openSheet}>
        {buttonContentComponent}
      </TouchableOpacity>
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={sheetStyle}
      >
        <BottomSheet
          title={sheetTitle}
          actions={sheetActions}
          bottomSheetRef={bottomSheetRef}
        />
      </RBSheet>
    </View>
  );
}

type CustomBottomSheetButtonProps = {
  exitSheet: boolean;
  buttonContentComponent: React.ReactElement;
  sheetTitle?: string;
  sheetContentComponent: React.ReactElement;
  propsStyle?: object;
};

// TODO: add TS types https://reactnavigation.org/docs/typescript/
export function CustomBottomSheetButton({
  exitSheet,
  buttonContentComponent,
  sheetTitle,
  sheetContentComponent,
  propsStyle,
}: CustomBottomSheetButtonProps) {
  const bottomSheetRef = useRef<RBSheet>(null);

  useEffect(() => {
    if (exitSheet) {
      bottomSheetRef.current?.close();
    }
  }, [exitSheet]);

  const openSheet = () => {
    bottomSheetRef.current?.open();
  };

  return (
    <View>
      <TouchableOpacity onPress={openSheet}>
        {buttonContentComponent}
      </TouchableOpacity>
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{ ...sheetStyle, ...propsStyle }} // Must be an object. Cannot use styles array
      >
        <CustomBottomSheet title={sheetTitle} bottomSheetRef={bottomSheetRef}>
          {sheetContentComponent}
        </CustomBottomSheet>
      </RBSheet>
    </View>
  );
}

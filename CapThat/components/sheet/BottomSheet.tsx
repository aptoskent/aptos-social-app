import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Heading2 from '../text/Heading2';
import Icon from 'react-native-remix-icon';
import { GLOBAL_WARNING_COLOR } from '../../constants';

export const BOTTOM_SHEET_MARGIN_HORIZONTAL = 20;

export enum BottomSheetActionType {
  REGULAR = 'REGULAR',
  WARNING = 'WARNING',
}

export type BottomSheetAction = {
  name: string;
  iconName: string;
  actionType: BottomSheetActionType;
  actionFunction: () => void;
};

type BottomSheetProps = {
  title: string;
  actions: BottomSheetAction[];
  bottomSheetRef: any;
};

export default function BottomSheet({
  title,
  actions,
  bottomSheetRef,
}: BottomSheetProps) {
  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.title}>
          <Heading2>{title}</Heading2>
        </View>
      )}
      {actions.map((action, index) => {
        const isWarning = action.actionType === BottomSheetActionType.WARNING;
        return (
          <TouchableOpacity
            style={styles.action}
            key={index}
            onPress={() => {
              bottomSheetRef.current.close();
              action.actionFunction();
            }}
          >
            <Icon
              name={action.iconName}
              size="22"
              color={isWarning ? GLOBAL_WARNING_COLOR : 'white'}
            />
            <Heading2 warning={isWarning}>{action.name}</Heading2>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

type CustomBottomSheetProps = {
  title?: string;
  bottomSheetRef: any;
  children: React.ReactElement;
};

export function CustomBottomSheet({
  title,
  bottomSheetRef,
  children,
}: CustomBottomSheetProps) {
  return (
    <View style={styles.container}>
      {!!title && (
        <View style={styles.title}>
          <Heading2>{title}</Heading2>
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: BOTTOM_SHEET_MARGIN_HORIZONTAL,
  },
  title: {
    alignItems: 'center',
    marginVertical: 12,
  },
  action: {
    flexDirection: 'row',
    marginVertical: 12,
    gap: 16,
    alignItems: 'center',
  },
});

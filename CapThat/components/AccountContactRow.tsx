import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { GLOBAL_TEXT_COLOR_PLACEHOLDER } from '../constants';
import { TEXT_COLOR_PRIMARY } from './text/constants';
import Icon from 'react-native-remix-icon';
import Heading2 from './text/Heading2';

type AccountSettingRowProps = {
  iconName: string;
  label: string;
  onPress: () => void;
};
const AccountSettingRow = ({
  iconName,
  label,
  onPress,
}: AccountSettingRowProps) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress}>
    <View style={styles.leftSide}>
      <Icon name={iconName} size={22} color={TEXT_COLOR_PRIMARY} />
      <View style={styles.setting}>
        <Heading2>{label}</Heading2>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  settingRow: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  setting: {
    flexDirection: 'column',
    gap: 4,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GLOBAL_TEXT_COLOR_PLACEHOLDER,
  },
});

export default AccountSettingRow;

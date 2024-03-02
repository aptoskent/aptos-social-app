import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TEXT_COLOR_PRIMARY } from '../text/constants';
import Icon from 'react-native-remix-icon';

type SecondaryButtonProps = {
  title: string;
  iconName?: string;
  onPress: () => void;
};

export default function SecondaryButton({
  title,
  iconName,
  onPress,
}: SecondaryButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {iconName && (
        <Icon name={iconName} size={22} color={TEXT_COLOR_PRIMARY} />
      )}
      {title !== '' && <Text style={styles.title}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    gap: 8,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'clash-display-bold',
    color: TEXT_COLOR_PRIMARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

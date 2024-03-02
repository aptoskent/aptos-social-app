import Icon from 'react-native-remix-icon';
import { StyleSheet, TouchableOpacity } from 'react-native';

type RoundIconButtonProps = {
  iconName: string;
  onPress: () => void;
};

export default function RoundIconButton({
  iconName,
  onPress,
}: RoundIconButtonProps) {
  return (
    <TouchableOpacity style={styles.cameraButton} onPress={onPress}>
      <Icon name={iconName} size={22} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cameraButton: {
    backgroundColor: '#444A5E',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GLOBAL_PRIMARY_COLOR, LogEvent } from '../../constants';
import { TEXT_COLOR_PRIMARY, TEXT_COLOR_SECONDARY } from '../text/constants';
import Icon from 'react-native-remix-icon';

// styles
import tw from '../../tailwind.js';
import { useAnalytics } from '../../hooks/useAnalytics';

type PrimaryButtonProps = {
  title: string;
  iconName?: string;
  disabled?: boolean;
  onPress: () => void;
  propStyles?: object;
  titleStyles?: object;
  pressEventName?: LogEvent;
  pressEventParams?: object;
};

export default function PrimaryButton({
  title,
  iconName,
  disabled,
  onPress,
  propStyles,
  titleStyles,
  pressEventName,
  pressEventParams,
}: PrimaryButtonProps) {
  const { logFirebaseEvent } = useAnalytics();

  return (
    <TouchableOpacity
      style={tw(
        'rounded-2xl p-4 flex-row items-center gap-2.5 h-14 justify-center',
        {
          backgroundColor: disabled
            ? TEXT_COLOR_SECONDARY
            : GLOBAL_PRIMARY_COLOR,
        },
        propStyles,
      )}
      disabled={disabled}
      onPress={() => {
        if (pressEventName) {
          logFirebaseEvent(pressEventName, pressEventParams);
        }
        onPress();
      }}
    >
      {iconName && (
        <Icon name={iconName} size={22} color={TEXT_COLOR_PRIMARY} />
      )}
      {!!title && <Text style={[styles.title, titleStyles]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'clash-display-bold',
    color: TEXT_COLOR_PRIMARY,
    fontSize: 16,
  },
});

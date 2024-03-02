import { Text, TouchableOpacity } from 'react-native';
import { LogEvent } from '../../constants';
import { useAnalytics } from '../../hooks/useAnalytics';

const DEFAULT_TEXT_COLOR = '#6F83E9';

type SupportingButtonProps = {
  title: string;
  disabled?: boolean;
  textColor?: string; // TODO: use better style management
  onPress: () => void;
  noPadding?: boolean;
  pressEventName?: LogEvent;
  pressEventParams?: object;
};

export default function SupportingButton({
  title,
  disabled,
  textColor,
  onPress,
  noPadding,
  pressEventName,
  pressEventParams,
}: SupportingButtonProps) {
  const { logFirebaseEvent } = useAnalytics();

  return (
    <TouchableOpacity
      style={{
        padding: noPadding ? undefined : 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
      disabled={disabled}
      onPress={() => {
        if (pressEventName) {
          logFirebaseEvent(pressEventName, pressEventParams);
        }
        onPress();
      }}
    >
      {title !== '' && (
        <Text
          style={{
            fontFamily: 'clash-display-bold',
            color: textColor || DEFAULT_TEXT_COLOR,
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

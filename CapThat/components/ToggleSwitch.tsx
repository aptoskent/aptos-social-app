import { Switch } from 'react-native';
import { GLOBAL_PRIMARY_COLOR } from '../constants';
import { TEXT_COLOR_SECONDARY } from './text/constants';

type ToggleSwitchProps = {
  isOn: boolean;
  toggle: () => void;
};

export default function ToggleSwitch({ isOn, toggle }: ToggleSwitchProps) {
  return (
    <Switch
      trackColor={{ false: TEXT_COLOR_SECONDARY, true: GLOBAL_PRIMARY_COLOR }}
      thumbColor="white"
      ios_backgroundColor={TEXT_COLOR_SECONDARY}
      onValueChange={toggle}
      value={isOn}
    />
  );
}

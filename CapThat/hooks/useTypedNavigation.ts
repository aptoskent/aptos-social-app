import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ParamList } from '../nav/types';

export const useTypedNavigation = () => {
  return useNavigation<NavigationProp<ParamList>>();
};

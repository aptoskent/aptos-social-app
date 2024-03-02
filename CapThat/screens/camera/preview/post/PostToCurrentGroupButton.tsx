import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-remix-icon';
import { SCREEN_NAME_GROUP } from '../../../../nav/constants';
import { GLOBAL_PRIMARY_COLOR } from '../../../../constants';
import { ActionType } from '../../ActionType';
import { useTypedNavigation } from '../../../../hooks/useTypedNavigation';

type PostToGroupButtonProps = {
  submitPost: (groupId: string) => void;
  action: ActionType;
  groupId: string;
};

export default function PostToCurrentGroupButton({
  submitPost,
  groupId,
}: PostToGroupButtonProps) {
  const navigation = useTypedNavigation();
  const onSubmitPress = (navigation: any, groupId: string) => {
    submitPost(groupId);
    navigation.navigate(SCREEN_NAME_GROUP, { groupId: groupId });
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: GLOBAL_PRIMARY_COLOR,
        padding: 16,
        borderRadius: 16,
      }}
      onPress={() => onSubmitPress(navigation, groupId)}
    >
      <Icon name="send-plane-2-fill" size="22" color="white" />
    </TouchableOpacity>
  );
}

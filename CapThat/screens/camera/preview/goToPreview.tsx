import { useTypedNavigation } from '../../../hooks/useTypedNavigation';
import { SCREEN_NAME_PREVIEW_POST } from '../../../nav/constants';
import { ActionType } from '../ActionType';

export function goToPreview(
  navigation: ReturnType<typeof useTypedNavigation>,
  action: ActionType,
  imageUri: string,
  groupId?: string,
) {
  if (!action || action === ActionType.CREATE_POST) {
    navigation.navigate(SCREEN_NAME_PREVIEW_POST, {
      imageUri: imageUri,
      action: ActionType.CREATE_POST,
    });
  } else if (action === ActionType.CREATE_POST_FROM_GROUP && groupId) {
    navigation.navigate(SCREEN_NAME_PREVIEW_POST, {
      imageUri: imageUri,
      action: action,
      groupId: groupId,
    });
  } else {
    navigation.navigate(SCREEN_NAME_PREVIEW_POST, {
      imageUri: imageUri,
      action: action,
    });
  }
}

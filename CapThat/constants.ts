export const GLOBAL_BACKGROUND_COLOR = '#1F2128';
export const GLOBAL_HEADER_COLOR_PLACEHOLDER = '#837CF6';
export const GLOBAL_HEADER_COLOR_PLACEHOLDER_2 = '#E4716D';
export const GLOBAL_PRIMARY_COLOR = '#7737FF';
export const GLOBAL_SCREEN_MARGIN_HORIZONTAL = 16;
export const GLOBAL_TEXT_COLOR_PLACEHOLDER = '#aaaaaa';
export const GLOBAL_WARNING_COLOR = '#FFAC30';
export const GLOBAL_BOTTOM_SHEET_BACKGROUND_COLOR = '#333041'; // "rgba(74,68,94,0.7)";
export const GLOBAL_SUCCESS_COLOR = '#34D357';
export const GLOBAL_BACKGROUND_MODAL_COLOR = '#4A445EB2'; // "rgba(74, 68, 94, 0.7)";

export enum LogEvent {
  BUTTON = 'button',
  TAP = 'tap',
  APP_OPEN_SELF_DEFINED = 'app_open_self_defined',
  COMPLETE_ONBOARDING = 'complete_onboarding',
  USER_LOGGED_IN_AND_FINISHED_ONBOARDING = 'user_logged_in_and_finished_onboarding',
  USER_LOGGED_IN_AND_UNFINISHED_ONBOARDING = 'user_logged_in_and_unfinished_onboarding',
  USER_LOGGED_OUT = 'user_logged_out',
}

export enum LogEventButtonName {
  // onboarding related
  PROCEED_PHONE = 'proceed_phone',
  SEND_VERIFICATION = 'send_verification',
  CONFIRM_VERIFICATION = 'confirm_verification',
  CONFIRM_INVITE_CODE = 'confirm_invite_code',
  CONFIRM_BIRTHDAY = 'confirm_birthday',
  CONFIRM_PRONOUN = 'confirm_pronoun',
  CONFIRM_FULL_NAME = 'confirm_full_name',
  CONFIRM_USERNAME = 'confirm_username',
  CONFIRM_EMAIL = 'confirm_email',
  CONFIRM_NOTIFICATION_PERMISSION = 'confirm_notification_permission',

  // post related
  COMMENT_POST = 'comment_post',
  LIKE_POST = 'like_post',
  UNLIKE_POST = 'unlike_post',
  CONFIRM_GROUP_TO_POST = 'confirm_group_to_post',
  CREATE_POST = 'create_post',
  CAPTURE_POST = 'capture_post',
  OPEN_GALLERY = 'open_gallery',
  ABANDON_POST = 'abandon_post',
  DOWNLOAD_POST = 'download_post',
  CONFIRM_CAPTION = 'confirm_caption',
  EDIT_POST = 'edit_post',
  CONFIRM_EDIT_POST = 'confirm_edit_post',
  CONFIRM_DELETE_POST = 'confirm_delete_post',

  // group related
  CREATE_GROUP = 'create_group',
  JOIN_GROUP = 'join_group',
  DECLINE_JOIN_GROUP = 'decline_join_group',
  SHUFFLE_MASCOT = 'shuffle_mascot',
  INVITE_TO_GROUP = 'invite_to_group',
  COPY_INVITE_LINK = 'copy_invite_link',
  SHARE_INVITE_LINK = 'share_invite_link',
  LEAVE_GROUP = 'leave_group',
  CONFIRM_LEAVE_GROUP = 'confirm_leave_group',
}

export enum LogEventTapName {
  // navigation related
  NAVIGATE_TO_GROUP = 'navigate_to_group',
  NAVIGATE_TO_POST = 'navigate_to_post',
  NAVIGATE_TO_USER = 'navigate_to_user',
  NAVIGATE_TO_MY_PROFILE = 'navigate_to_my_profile',
  NAVIGATE_TO_CREATION = 'navigate_to_creation',
  NAVIGATE_TO_DISCOVER = 'navigate_to_discover',
}

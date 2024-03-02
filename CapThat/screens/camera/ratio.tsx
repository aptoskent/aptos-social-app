import { ActionType } from './ActionType';

export const UPLOADED_IMAGE_SIZE = 800;
export const UPLOADED_THUMBNAIL_SIZE = 240;

export const IMAGE_QUALITY = 80; // 100 would be really good quality
export const THUMBNAIL_QUALITY = 80;

export const IMAGE_FORMAT = 'JPEG';

export const CAMERA_CROP_RATIO_SQUARE = 1;
export const CAMERA_CROP_RATIO_PORTRAIT = 2 / 3;

export function getCameraRatio(actionType: ActionType) {
  if (!actionType) {
    return CAMERA_CROP_RATIO_PORTRAIT;
  }

  switch (actionType) {
    case ActionType.CREATE_POST:
    case ActionType.CREATE_POST_FROM_GROUP:
      return CAMERA_CROP_RATIO_PORTRAIT;
    case ActionType.UPLOAD_PROFILE_PHOTO:
      return CAMERA_CROP_RATIO_SQUARE;
  }
}

export function getImageRatioByActionType(
  width: number,
  height: number,
  actionType: ActionType,
) {
  if (actionType === ActionType.UPLOAD_PROFILE_PHOTO) {
    return CAMERA_CROP_RATIO_SQUARE;
  } else {
    return getImageRatio(width, height);
  }
}

function getImageRatio(width: number, height: number) {
  const isPortrait = CAMERA_CROP_RATIO_PORTRAIT - width / height > -0.1;
  return isPortrait ? CAMERA_CROP_RATIO_PORTRAIT : CAMERA_CROP_RATIO_SQUARE;
}

export function getCenterCropData(
  width: number,
  height: number,
  targetRatio: number,
): {
  originX: number;
  originY: number;
  width: number;
  height: number;
} {
  const targetRatioReverse = 1 / targetRatio;

  let croppedWidth, croppedHeight, originX, originY;
  if (width > height) {
    // square
    croppedWidth = height;
    croppedHeight = height;
    originX = (width - height) / 2;
    originY = 0;
  } else {
    // portrait
    if (height / width > targetRatioReverse) {
      // remove top and bottom
      croppedWidth = width;
      croppedHeight = width * targetRatioReverse;
      originX = 0;
      originY = (height - width * targetRatioReverse) / 2;
    } else {
      // remove left and right
      croppedWidth = height / targetRatioReverse;
      croppedHeight = height;
      originX = (width - height / targetRatioReverse) / 2;
      originY = 0;
    }
  }

  return {
    originX: originX,
    originY: originY,
    width: croppedWidth,
    height: croppedHeight,
  };
}

function getSize(
  width: number,
  height: number,
  imageRatio: number,
  resultImageSize: number,
): { width: number; height: number } {
  const maxWidth = resultImageSize;
  const maxHeight = resultImageSize / imageRatio;
  const resizeWidth = width > maxWidth ? maxWidth : width;
  const resizeHeight = height > maxHeight ? maxHeight : height;
  return { width: resizeWidth, height: resizeHeight };
}

export function getUploadImageSize(
  width: number,
  height: number,
  imageRatio: number,
): { width: number; height: number } {
  return getSize(width, height, imageRatio, UPLOADED_IMAGE_SIZE);
}

export function getThumbnailSize(
  width: number,
  height: number,
  imageRatio: number,
): { width: number; height: number } {
  return getSize(width, height, imageRatio, UPLOADED_THUMBNAIL_SIZE);
}

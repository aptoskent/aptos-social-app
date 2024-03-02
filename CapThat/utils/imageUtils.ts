import { PostImage } from 'CapThat/components/gallery/dataHelper';

export function getPhotoRatio(image: PostImage) {
  // TODO: @jianyi width and height should always be present, think about what to do if they are not
  if (!('metadata' in image)) {
    return 1;
  }

  if (!('width' in image.metadata) || !('height' in image.metadata)) {
    return 1;
  }

  return image.metadata.width / image.metadata.height;
}

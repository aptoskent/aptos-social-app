import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import database from '@react-native-firebase/database';

export type NotificationType = 'post' | 'comment';

interface Notification {
  type: NotificationType;
  senderId: string;
}

export interface PostNotification extends Notification {
  groupId: string;
  postId: string;
  imageUrl: string;
}

export interface CommentNotification extends Notification {
  postId: string;
  imageUrl: string;
  comment: string;
}

export async function createPostNotification(postData: PostNotification) {
  const metadataRef = database().ref('posts/');
  await metadataRef.push(postData);
}

export async function createCommentNotification(
  commentData: CommentNotification,
) {
  const metadataRef = database().ref('comments/' + commentData.postId + '/');
  await metadataRef.push(commentData);
}

export async function requestPushToken(): Promise<string | null> {
  // only request push token if on a device
  if (Device.isDevice) {
    const { status: status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    return (await Notifications.getExpoPushTokenAsync()).data;
  }
  return null;
}

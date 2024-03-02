import { ExpoPushMessage, Expo } from 'expo-server-sdk';

/**
 * Composes push notifications with the provided title, body, and push tokens.
 *
 * @param {string[]} pushTokens - An array of push tokens to send the notif to.
 * @param {string} title - The title of the notification.
 * @param {string} body - The body content of the notification.
 * @param {Map<string, any>} data - The data to send with the notification.
 * @return {void}
 */
export async function composeNotifications(
  pushTokens: string[],
  title: string,
  body: string,
  data: any,
): Promise<ExpoPushMessage> {
  const tokens = pushTokens.filter((pushToken) =>
    Expo.isExpoPushToken(pushToken),
  );
  console.log('tokens', tokens);
  return {
    to: tokens,
    title: title,
    body: body,
    data: data,
  };
}

/**
 * Sends push notifications to multiple devices.
 *
 * @param {ExpoPushMessage[]} messages - An array of push notif msgs to send.
 * @return {Promise<string[]>} A Promise resolving to an array of receipt ids.
 */
export async function sendNotifications(
  messages: ExpoPushMessage[],
): Promise<string[]> {
  const expo = new Expo();
  const ticketChunk = await expo.sendPushNotificationsAsync(messages);
  const receipts: string[] = [];
  for (const ticket of ticketChunk) {
    if (ticket.status === 'ok') {
      receipts.push(ticket.id);
    } else {
      // Handle the failed tickets
      console.error(`Error sending notification: ${ticket.message}`);
    }
  }
  return receipts;
}

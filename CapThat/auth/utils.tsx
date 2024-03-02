import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export type UserInfo = {
  birthday: string;
  full_name: {
    first_name: string;
    last_name: string;
  };
  pronoun: string;
  username: string;
  invite_code: string;
};

export async function isNewUser(
  user: FirebaseAuthTypes.User,
): Promise<boolean> {
  const snapshot = await database()
    .ref('metadata')
    .child(user.uid)
    .once('value');
  return !snapshot.exists();
}

export async function finishedOnboarding(
  user: FirebaseAuthTypes.User,
): Promise<boolean> {
  const snapshot = await database()
    .ref('userInfo')
    .child(user.uid)
    .once('value');
  return snapshot.exists();
}

export async function isInviteCodeValidAndEnabled(
  inviteCode: string,
): Promise<boolean> {
  const snapshot = await database()
    .ref('inviteCodes')
    .child(inviteCode)
    .once('value');
  return snapshot.exists() && snapshot.val().enabled === true;
}

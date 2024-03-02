import { User } from '../gallery/dataHelper';

export function getInitials(
  userData:
    | {
        full_name?: { first_name?: string; last_name?: string };
        username: string;
      }
    | null
    | undefined,
): string | undefined {
  const fullName = userData?.full_name;
  if (fullName) {
    const firstName = fullName.first_name;
    const lastName = fullName.last_name;
    if (firstName && lastName) {
      return firstName[0] + lastName[0];
    }
  }

  return userData?.username[0];
}

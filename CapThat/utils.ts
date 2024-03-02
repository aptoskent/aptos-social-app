export function convertTimestampToUserTime(timestamp: string): string {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const currentTime = new Date();
  const elapsedTime = currentTime.getTime() - date.getTime();
  const elapsedSeconds = Math.floor(elapsedTime / 1000);

  let userDateTime = '';

  if (elapsedSeconds < 60) {
    userDateTime = `${elapsedSeconds} seconds ago`;
  } else if (elapsedSeconds < 3600) {
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    userDateTime = `${elapsedMinutes} minutes ago`;
  } else if (elapsedSeconds < 86400) {
    const elapsedHours = Math.floor(elapsedSeconds / 3600);
    userDateTime = `${elapsedHours} ${elapsedHours > 1 ? 'hours' : 'hour'} ago`;
  } else {
    userDateTime = date.toLocaleString(undefined, {
      timeZone: userTimeZone,
      dateStyle: 'long',
      timeStyle: 'short',
    });
  }

  return userDateTime;
}

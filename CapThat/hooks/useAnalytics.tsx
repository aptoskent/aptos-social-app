import analytics from '@react-native-firebase/analytics';
import { useCallback, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { LogEvent } from '../constants';

export const useAnalytics = () => {
  const { userId, authUser } = useContext(AuthContext);

  const logFirebaseEvent = useCallback(
    (eventName: LogEvent, params?: object) => {
      // TODO: remove after done adding all logs
      console.log(
        'useAnalytics: logFirebaseEvent',
        eventName,
        JSON.stringify(params, null, 2),
      );
      // swallows errors
      analytics()
        .logEvent(eventName, {
          user_id: userId,
          user_uid: authUser?.uid,
          ...params,
        })
        .catch((error) => {
          console.error('useAnalytics: logFirebaseEvent error', error);
        });
    },
    [userId, authUser],
  );

  return {
    logFirebaseEvent,
  };
};

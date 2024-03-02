import { useState, ReactNode } from 'react';
import { TouchableWithoutFeedback } from 'react-native';

type MultiTapNoFeedback = {
  children: ReactNode;
  delay?: number;
  onSingleTap?: () => void;
  onDoubleTap?: () => void;
};

const MultiTapNoFeedback = (props: MultiTapNoFeedback) => {
  const { onSingleTap, onDoubleTap, children, delay = 300 } = props;

  const [lastTap, setLastTap] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < delay) {
      clearTimeout(timeoutId!); // clear timeout to prevent single tap action
      onDoubleTap?.();
      setLastTap(null); // reset lastTap
    } else {
      setLastTap(now);
      // set timeout for single tap
      setTimeoutId(
        setTimeout(() => {
          onSingleTap?.();
        }, delay),
      );
    }
  };

  return (
    // Can only take 1 child component. Wrap multiple children in a <View />.
    <TouchableWithoutFeedback onPress={handleTap}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default MultiTapNoFeedback;

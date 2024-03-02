import { useRef } from 'react';
import { Animated, Dimensions, Image, View } from 'react-native';
import { GLOBAL_SCREEN_MARGIN_HORIZONTAL } from 'CapThat/constants';
import Icon from 'react-native-remix-icon';
import MultiTapNoFeedback from './MultiTapNoFeedback';

import tw from 'CapThat/tailwind';

const IMAGE_SIZE =
  Dimensions.get('window').width - 2 * GLOBAL_SCREEN_MARGIN_HORIZONTAL;

const DURATION = 500;

type Props = {
  imgUri: string;
  aspectRatio?: number;
  onSingleTap?: () => void;
  onDoubleTapSecondaryAction?: () => void;
};

const DoubleTapHeartImage = (props: Props) => {
  const { imgUri, aspectRatio, onSingleTap, onDoubleTapSecondaryAction } =
    props;

  const heartScale = useRef(new Animated.Value(1)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  const heartPost = () => {
    heartScale.setValue(0);
    heartOpacity.setValue(0);

    if (onDoubleTapSecondaryAction) {
      setTimeout(onDoubleTapSecondaryAction, 300);
    }

    // Animate heart icon to expand and become visible
    Animated.parallel([
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.timing(heartOpacity, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After the animation is complete, set the opacity back to 0

      Animated.timing(heartOpacity, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <MultiTapNoFeedback onSingleTap={onSingleTap} onDoubleTap={heartPost}>
      <View style={tw('items-center')}>
        <Image
          source={{ uri: imgUri }}
          style={tw('rounded-lg', {
            width: IMAGE_SIZE,
            aspectRatio: aspectRatio,
          })}
        />
        <Animated.View
          style={{
            top: '50%',
            position: 'absolute',
            opacity: heartOpacity,
            transform: [
              {
                scale: heartScale,
              },
            ],
          }}
        >
          <Icon name={'heart-fill'} color="white" size={80} />
        </Animated.View>
      </View>
    </MultiTapNoFeedback>
  );
};

export default DoubleTapHeartImage;

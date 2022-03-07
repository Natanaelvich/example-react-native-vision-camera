import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const CircleFocus: React.FC<{x: number; y: number}> = ({x, y}) => {
  const positionY = useSharedValue(x);
  const positionx = useSharedValue(y);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    positionY.value = y - 50;
    positionx.value = x - 50;
    scale.value = withTiming(1);
    opacity.value = withTiming(1);

    scale.value = withDelay(1000, withTiming(0));
    opacity.value = withDelay(1000, withTiming(0));
  }, [x, y, positionY, positionx, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {translateY: positionY.value},
      {translateX: positionx.value},
      {scaleX: scale.value},
      {scaleY: scale.value},
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: 'red',
          position: 'absolute',
        },
        animatedStyle,
      ]}
    />
  );
};

export default CircleFocus;

import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const CircleFocus: React.FC<{x: number; y: number}> = ({x, y}) => {
  const positionY = useSharedValue(x);
  const positionx = useSharedValue(y);

  useEffect(() => {
    positionY.value = withTiming(y - 50);
    positionx.value = withTiming(x - 50);
  }, [x, y, positionY, positionx]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: positionY.value}, {translateX: positionx.value}],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 100,
          height: 100,
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

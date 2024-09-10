import type { PropsWithChildren } from 'react';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type PressableOpacityProps = PropsWithChildren<{
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  minOpacity?: number;
}>;

// Create the PressableOpacity component
const PressableOpacity: React.FC<PressableOpacityProps> = ({
  children,
  onPress,
  onLongPress,
  style,
  minOpacity = 0.92,
}) => {
  // Create a shared value to track the press state
  const active = useSharedValue(false);

  // Create a tap gesture handler
  const gesture = Gesture.Tap()
    .maxDuration(4000) // Set maximum duration for tap gesture
    .onTouchesDown(() => {
      active.value = true; // Mark as active on touch down
    })
    .onTouchesUp(() => {
      if (onPress != null) runOnJS(onPress)(); // Execute onPress on touch up
    })
    .onFinalize(() => {
      active.value = false; // Reset press state on finalize
    });

  const longPressGesture = Gesture.LongPress().onStart(() => {
    if (onLongPress != null) runOnJS(onLongPress)();
  });

  const opacity = useDerivedValue(() => {
    if (active.value) {
      return minOpacity;
    }
    return withTiming(1);
  }, [minOpacity]);

  // Create an animated style for opacity effect
  const rAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Set opacity to minOpacity when active, return to normal otherwise
      opacity: withTiming(active.value ? opacity.value : 1),
    };
  }, [minOpacity]);

  const gestures = Gesture.Exclusive(longPressGesture, gesture);

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[style, rAnimatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
};

export { PressableOpacity };

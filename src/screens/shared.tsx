// Import necessary components and types from libraries and files
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { useCallback } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';

import type { ParamList } from '../navigation/types';
import { AnimatedImage } from '../components/animated-image';

// Define the ExpandedImageScreen component to display an enlarged image
export function ExpandedImageScreen({
  route,
  navigation,
}: NativeStackScreenProps<ParamList, 'ExpandedImageScreen'>) {
  // Extract tag and imageUri from route params
  const { tag, imageUri } = route.params;

  // Retrieve window dimensions
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Callback function to navigate back to the HomeScreen
  const goBack = useCallback(() => {
    navigation.navigate('HomeScreen');
  }, [navigation]);

  // Shared value for offset
  const offset = useSharedValue({ x: 0, y: 0 });

  // Derived value for scale
  const scale = useDerivedValue(() => {
    const y = Math.abs(offset.value.y);
    return Math.max(1 - y / windowHeight, 0.5);
  }, [windowHeight]);

  // Animated style for translation
  const translation = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x * 0.3 },
        { translateY: offset.value.y * 0.3 },
        { scale: scale.value },
      ],
    };
  });

  // Gesture handling for pan
  const pan = Gesture.Pan()
    .onChange(e => {
      offset.value = {
        x: e.changeX + offset.value.x,
        y: e.changeY + offset.value.y,
      };
      if (Math.abs(offset.value.x) > 150 || Math.abs(offset.value.y) > 250) {
        runOnJS(goBack)();
      }
    })
    .onFinalize(() => {
      offset.value = withSpring(
        { x: 0, y: 0 },
        {
          mass: 0.5,
        },
      );
    });

  // Calculate image size
  const imageSize = windowWidth * 0.7;

  // Render the ExpandedImageScreen component
  return (
    <>
      {/* Render a BlurView */}
      <BlurView
        intensity={25}
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      />
      <GestureDetector gesture={pan}>
        <Animated.View style={styles.fillCenter}>
          <Animated.View style={translation}>
            {/* Render an AnimatedImage component */}
            <AnimatedImage
              source={{
                uri: imageUri, // Set image source URI
              }}
              priority={'high'} // Set priority for image loading
              recyclingKey={imageUri} // Set recycling key for the image
              cachePolicy={'memory-disk'} // Set cache policy
              sharedTransitionTag={tag} // Set shared transition tag
              style={{
                height: imageSize, // Set height of the image
                width: windowWidth * 0.9, // Set width of the image
                borderRadius: 25, // Set border radius
              }}
              contentFit="cover" // Set content fit property
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

// Define styles for the ExpandedImageScreen component
export const styles = StyleSheet.create({
  fillCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

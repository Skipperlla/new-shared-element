// Import necessary components and types from libraries and files
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AnimatedImage } from '../components/animated-image';
import { PressableOpacity } from '../components/pressable-opacity';
import { Palette, data } from '../constants';
import type { ParamList } from '../navigation/types';
import { mediumHaptic } from '../utils';

// Define the HomeScreen component which displays a list of images
const HomeScreen = ({
  navigation, // navigation prop received from React Navigation
}: NativeStackScreenProps<ParamList, 'HomeScreen'>) => {
  // Retrieve window dimensions
  const { width: windowWidth } = useWindowDimensions();

  // Define constants for layout spacing
  const fullGap = 20;
  const singleGap = fullGap / 3;

  // Get the header height using the useHeaderHeight hook
  const headerHeight = useHeaderHeight();

  // Calculate item size based on window width and layout spacing
  const itemSize = (windowWidth - fullGap) / 3;

  // Render the HomeScreen component
  return (
    <View
      style={[
        styles.fillCenter,
        {
          backgroundColor: Palette.background, // Set background color
        },
      ]}
    >
      {/* Render a FlatList to display images */}
      <FlatList
        data={data} // Pass the data array to FlatList
        numColumns={3} // Display items in 3 columns
        contentContainerStyle={{
          marginLeft: singleGap, // Set left margin for items
          gap: singleGap, // Set gap between items
          paddingVertical: headerHeight + singleGap, // Set vertical padding
        }}
        renderItem={({ item, index }) => {
          return (
            // Render a PressableOpacity component for each item
            <PressableOpacity
              minOpacity={0.5} // Set minimum opacity for the PressableOpacity
              style={{
                width: windowWidth / 3, // Set width of PressableOpacity
              }}
              onLongPress={() => {
                // Trigger a haptic feedback on long press
                mediumHaptic();
                // Navigate to ExpandedImageScreen passing tag and imageUri
                navigation.navigate('ExpandedImageScreen', {
                  tag: index.toString(),
                  imageUri: item.url,
                });
              }}
            >
              {/* Render an AnimatedImage component for each item */}
              <AnimatedImage
                source={{
                  uri: item.url, // Set image source URI
                }}
                //@ts-ignore
                placeholder={item.blurhash} // Set placeholder image
                priority={'high'} // Set priority for image loading
                recyclingKey={item.url} // Set recycling key for the image
                contentFit={'cover'} // Set content fit property
                cachePolicy={'memory-disk'} // Set cache policy
                sharedTransitionTag={index.toString()} // Set shared transition tag
                style={{
                  height: itemSize, // Set height of the image
                  width: itemSize, // Set width of the image
                }}
              />
            </PressableOpacity>
          );
        }}
      />
    </View>
  );
};

// Define styles for the HomeScreen component
const styles = StyleSheet.create({
  fillCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default HomeScreen;

// Import necessary modules from React and React Native
import { useMemo } from 'react';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import screens and constants from the application files
import { Palette } from './constants';
import HomeScreen from './screens/Home';
import { ExpandedImageScreen } from './screens/shared';

// Define the type for navigation parameters
type ParamList = {
  HomeScreen?: object;
  ExpandedImageScreen: { tag: string };
};

// Create a stack navigator instance with the defined parameter list
const Stack = createNativeStackNavigator<ParamList>();

// Define the main App component
const App = () => {
  // Define options for the home screen header using useMemo
  const homeScreenOptions = useMemo(() => {
    return {
      headerShown: true, // Show header
      headerTransparent: true, // Make header transparent
      headerBlurEffect: 'dark', // Apply dark blur effect to header
      title: 'Shared Transition', // Set header title
      headerTitleStyle: {
        color: Palette.text, // Set header title color
      },
    } as const;
  }, []);

  // Render the main App component
  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animation: 'fade', // Set default screen animation to fade
          }}
        >
          {/* Define the HomeScreen as a stack screen */}
          <Stack.Screen
            name="HomeScreen"
            options={homeScreenOptions} // Set options for HomeScreen
            component={HomeScreen} // Set HomeScreen component
          />
          {/* Define the ExpandedImageScreen as a stack screen */}
          <Stack.Screen
            name="ExpandedImageScreen"
            component={ExpandedImageScreen as unknown as React.ComponentType} // Set ExpandedImageScreen component
            options={{ headerShown: false, presentation: 'transparentModal' }} // Set options for ExpandedImageScreen
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

// Define styles for the main App component
const styles = StyleSheet.create({
  root: {
    flex: 1, // Take up all available space
  },
});
export default App;

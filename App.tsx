import React from 'react';
import 'expo-dev-client';
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Initializing } from '@app/components';

import AppComponent from './src/index';

const queryClient = new QueryClient();
void SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={style.container}>
        <Initializing />
        <SafeAreaProvider>
          <PortalProvider>
            <BottomSheetModalProvider>
              <AppComponent />
            </BottomSheetModalProvider>
          </PortalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

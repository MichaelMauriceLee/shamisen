import React from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
//@ts-expect-error this is a component that differs depending on platform
import MusicPlayer from './components/MusicPlayer';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={style.container}>
        <StatusBar barStyle="light-content" />
        <MusicPlayer />
      </SafeAreaView>
    </QueryClientProvider>
  );
};

export default App;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

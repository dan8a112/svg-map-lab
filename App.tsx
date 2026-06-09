import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SampleSVGMap } from '@/components/SampleSVGMap';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SampleSVGMap />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

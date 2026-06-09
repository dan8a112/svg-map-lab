import { useSharedValue } from 'react-native-reanimated';

export const useMapTransform = (initialScale: number = 1) => {
  const scale = useSharedValue(initialScale);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const reset = () => {
    scale.value = initialScale;
    translateX.value = 0;
    translateY.value = 0;
  };

  return {
    scale,
    translateX,
    translateY,
    reset,
  };
};

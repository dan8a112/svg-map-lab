import React, { useMemo, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { useMapTransform } from '@/hooks/useMapTransform';
import type { SVGMapProps } from '@/types';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const SPRING_CONFIG = { damping: 20, stiffness: 200 };

const SVG_CONTENT_WIDTH = 800;
const SVG_CONTENT_HEIGHT = 600;

export const InteractiveSVGMap: React.FC<SVGMapProps> = ({
  svgString,
}) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  // Calculate initial scale to fit SVG into container while maintaining aspect ratio
  const initialScale = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) {
      return 1;
    }
    const scaleX = containerSize.width / SVG_CONTENT_WIDTH;
    const scaleY = containerSize.height / SVG_CONTENT_HEIGHT;
    return Math.min(scaleX, scaleY);
  }, [containerSize]);

  const { scale, translateX, translateY } = useMapTransform(initialScale);

  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(initialScale);

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  // Fixed viewBox to show entire SVG content
  const fixedViewBox = `0 0 ${SVG_CONTENT_WIDTH} ${SVG_CONTENT_HEIGHT}`;

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .onStart((event) => {
          savedScale.value = scale.value;
          focalX.value = event.focalX;
          focalY.value = event.focalY;
          savedTranslateX.value = translateX.value;
          savedTranslateY.value = translateY.value;
        })
        .onUpdate((event) => {
          const newScale = Math.min(
            MAX_SCALE,
            Math.max(MIN_SCALE, savedScale.value * event.scale)
          );
          const scaleChange = newScale / savedScale.value;

          const newTx =
            focalX.value -
            scaleChange * (focalX.value - savedTranslateX.value);
          const newTy =
            focalY.value -
            scaleChange * (focalY.value - savedTranslateY.value);

          translateX.value = newTx;
          translateY.value = newTy;
          scale.value = newScale;
        })
        .onEnd(() => {
          if (scale.value < MIN_SCALE) {
            scale.value = withSpring(MIN_SCALE, SPRING_CONFIG);
          } else if (scale.value > MAX_SCALE) {
            scale.value = withSpring(MAX_SCALE, SPRING_CONFIG);
          }
        }),
    [scale, translateX, translateY, savedScale, savedTranslateX, savedTranslateY, focalX, focalY, initialScale]
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .maxPointers(1)
        .onStart(() => {
          savedTranslateX.value = translateX.value;
          savedTranslateY.value = translateY.value;
        })
        .onUpdate((event) => {
          translateX.value = savedTranslateX.value + event.translationX;
          translateY.value = savedTranslateY.value + event.translationY;
        }),
    [translateX, translateY, savedTranslateX, savedTranslateY]
  );

  const composedGesture = useMemo(
    () => Gesture.Race(pinchGesture, panGesture),
    [pinchGesture, panGesture]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={styles.mapContainer}>
        {containerSize.height > 0 && (
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.content, animatedStyle]}>
              <SvgXml
                xml={svgString}
                width={SVG_CONTENT_WIDTH}
                height={SVG_CONTENT_HEIGHT}
                viewBox={fixedViewBox}
              />
            </Animated.View>
          </GestureDetector>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // Use fixed SVG dimensions; Animated transform will handle pan/zoom
    width: SVG_CONTENT_WIDTH,
    height: SVG_CONTENT_HEIGHT,
  },
});

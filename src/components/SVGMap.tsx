import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { SVGMapProps } from '@/types';

export const SVGMap: React.FC<SVGMapProps> = ({
  svgString,
  bounds,
  locations = [],
  markers = [],
  onLocationPress,
  onMarkerPress,
}) => {
  return (
    <View style={styles.container}>
      <SvgXml
        xml={svgString}
        width="100%"
        height="100%"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

import { useCallback } from 'react';
import type { Location, Marker } from '@/types';

export const useTapDetection = (
  locations?: Location[],
  markers?: Marker[],
  onLocationPress?: (location: Location) => void,
  onMarkerPress?: (marker: Marker) => void,
) => {
  const handleSVGPress = useCallback(
    (elementId: string) => {
      if (locations && onLocationPress) {
        const location = locations.find(
          (loc) => loc.svgElementId === elementId
        );
        if (location) {
          onLocationPress(location);
        }
      }

      if (markers && onMarkerPress) {
        const marker = markers.find(
          (m) => m.id === elementId
        );
        if (marker) {
          onMarkerPress(marker);
        }
      }
    },
    [locations, markers, onLocationPress, onMarkerPress]
  );

  return { handleSVGPress };
};

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface Location {
  id: string;
  name: string;
  svgElementId: string;
}

export interface Marker {
  id: string;
  latitude: number;
  longitude: number;
}

export interface SVGMapProps {
  svgString: string;
  bounds: Bounds;
  locations?: Location[];
  markers?: Marker[];
  onLocationPress?: (location: Location) => void;
  onMarkerPress?: (marker: Marker) => void;
}

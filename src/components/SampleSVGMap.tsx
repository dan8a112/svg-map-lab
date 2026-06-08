import React from 'react';
import { SVGMap } from './SVGMap';
import type { Location } from '@/types';

const CAMPUS_SVG = `
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f0f0f0"/>
  
  <rect id="admin" x="50" y="50" width="200" height="150" fill="#e3f2fd" stroke="#1976d2" stroke-width="2"/>
  <text x="150" y="135" text-anchor="middle" font-size="16" fill="#000">Admin</text>
  
  <rect id="library" x="350" y="50" width="200" height="150" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="2"/>
  <text x="450" y="135" text-anchor="middle" font-size="16" fill="#000">Library</text>
  
  <rect id="cafeteria" x="650" y="50" width="100" height="150" fill="#fff3e0" stroke="#f57c00" stroke-width="2"/>
  <text x="700" y="135" text-anchor="middle" font-size="12" fill="#000">Cafe</text>
  
  <circle id="plaza" cx="400" cy="400" r="100" fill="#e8f5e9" stroke="#388e3c" stroke-width="2"/>
  <text x="400" y="410" text-anchor="middle" font-size="16" fill="#000">Plaza</text>
</svg>
`;

const LOCATIONS: Location[] = [
  { id: 'admin', name: 'Administración', svgElementId: 'admin' },
  { id: 'library', name: 'Biblioteca', svgElementId: 'library' },
  { id: 'cafeteria', name: 'Cafetería', svgElementId: 'cafeteria' },
  { id: 'plaza', name: 'Plaza Central', svgElementId: 'plaza' },
];

export const SampleSVGMap: React.FC = () => {
  return (
    <SVGMap
      svgString={CAMPUS_SVG}
      bounds={{
        north: 15.5023,
        south: 15.4998,
        east: -88.0201,
        west: -88.0245,
      }}
      locations={LOCATIONS}
    />
  );
};

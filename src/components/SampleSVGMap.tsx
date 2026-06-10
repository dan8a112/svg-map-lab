import React from "react";
import { useWindowDimensions } from "react-native";
import { ResumableZoom } from "react-native-zoom-toolkit";
import { SVGMap } from "./SVGMap";

const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;

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

/**
 * LIMITACIÓN CONOCIDA - Calidad SVG en Zoom
 * 
 * Actual: SvgXml renderiza a textura fija (contentWidth × contentHeight).
 * Al hacer zoom >1x, ResumableZoom escala esa textura ? pixelación visible.
 * 
 * Solución futura: Migrar a @shopify/react-native-skia + SkiaSvg
 * - Renderizado vectorial GPU a resolución arbitraria
 * - Calidad perfecta a cualquier nivel de zoom
 * - Requiere reescribir SVGMap.tsx usando <Canvas> + <SkiaSvg>
 * 
 * Referencia: https://github.com/Shopify/react-native-skia
 */

export const SampleSVGMap: React.FC = () => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const initialScale = screenHeight / SVG_HEIGHT;
  const contentWidth = SVG_WIDTH * initialScale;
  const contentHeight = screenHeight;

  return (
    <ResumableZoom
      minScale={1}
      maxScale={5}
      panEnabled={true}
      pinchEnabled={true}
      tapsEnabled={true}
      extendGestures={true}
      decay={true}
      panMode="clamp"
      style={{ width: screenWidth, height: screenHeight }}
    >
      <SVGMap
        svgString={CAMPUS_SVG}
        style={{ width: contentWidth, height: contentHeight }}
      />
    </ResumableZoom>
  );
};

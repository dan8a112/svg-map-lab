# Fase 3: Projection Layer - Conversión de Coordenadas GPS

**Estado:** 🔲 No iniciado  
**Duración estimada:** 1-2 días  
**Dependencias:** Fase 1 (SVG Layer) ✅

---

## 📌 Objetivo

Crear un sistema de proyección que convierta coordenadas GPS reales a coordenadas del SVG y viceversa.

---

## 🎯 Tareas

### 3.1 Crear Tipos de Proyección
- [ ] Crear archivo `src/types/projection.ts`
- [ ] Definir interfaz `GPSCoordinate`
- [ ] Definir interfaz `SVGCoordinate`
- [ ] Definir interfaz `ProjectionBounds`

**Archivo:** `src/types/projection.ts`

```typescript
export interface GPSCoordinate {
  latitude: number;
  longitude: number;
}

export interface SVGCoordinate {
  x: number;
  y: number;
}

export interface ProjectionBounds {
  north: number;  // Latitud máxima (superior)
  south: number;  // Latitud mínima (inferior)
  east: number;   // Longitud máxima (derecha)
  west: number;   // Longitud mínima (izquierda)
}

export interface SVGBounds {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}
```

---

### 3.2 Crear Clase `CoordinateProjection`
- [ ] Crear archivo `src/utils/CoordinateProjection.ts`
- [ ] Implementar lógica de proyección Mercator simplificada
- [ ] Método `gpsToSvg(gps: GPSCoordinate): SVGCoordinate`
- [ ] Método `svgToGps(svg: SVGCoordinate): GPSCoordinate`
- [ ] Método `getBounds(): ProjectionBounds`

**Archivo:** `src/utils/CoordinateProjection.ts`

```typescript
import type {
  GPSCoordinate,
  SVGCoordinate,
  ProjectionBounds,
  SVGBounds,
} from '@/types/projection';

export class CoordinateProjection {
  private gpsBounds: ProjectionBounds;
  private svgBounds: SVGBounds;

  constructor(gpsBounds: ProjectionBounds, svgBounds: SVGBounds) {
    this.gpsBounds = gpsBounds;
    this.svgBounds = svgBounds;
  }

  /**
   * Convierte coordenadas GPS a coordenadas SVG
   */
  gpsToSvg(gps: GPSCoordinate): SVGCoordinate {
    const { latitude, longitude } = gps;
    const { north, south, east, west } = this.gpsBounds;

    // Rango de latitud y longitud
    const latRange = north - south;
    const lonRange = east - west;

    // Normalizar a 0-1
    const normalizedLat = (north - latitude) / latRange;
    const normalizedLon = (longitude - west) / lonRange;

    // Mapear a SVG
    const svgX =
      this.svgBounds.left +
      normalizedLon * this.svgBounds.width;
    const svgY =
      this.svgBounds.top +
      normalizedLat * this.svgBounds.height;

    return { x: svgX, y: svgY };
  }

  /**
   * Convierte coordenadas SVG a coordenadas GPS
   */
  svgToGps(svg: SVGCoordinate): GPSCoordinate {
    const { x, y } = svg;
    const { north, south, east, west } = this.gpsBounds;

    // Normalizar desde SVG a 0-1
    const normalizedLon =
      (x - this.svgBounds.left) / this.svgBounds.width;
    const normalizedLat =
      (y - this.svgBounds.top) / this.svgBounds.height;

    // Mapear a GPS
    const latitude = north - normalizedLat * (north - south);
    const longitude = west + normalizedLon * (east - west);

    return { latitude, longitude };
  }

  /**
   * Obtiene los bounds en GPS
   */
  getBounds(): ProjectionBounds {
    return { ...this.gpsBounds };
  }

  /**
   * Obtiene los bounds en SVG
   */
  getSVGBounds(): SVGBounds {
    return { ...this.svgBounds };
  }

  /**
   * Verifica si una coordenada GPS está dentro de los bounds
   */
  isGPSInBounds(gps: GPSCoordinate): boolean {
    const { latitude, longitude } = gps;
    const { north, south, east, west } = this.gpsBounds;

    return (
      latitude >= south &&
      latitude <= north &&
      longitude >= west &&
      longitude <= east
    );
  }

  /**
   * Calcula la distancia entre dos coordenadas GPS (aproximación)
   */
  distanceBetweenGPS(
    gps1: GPSCoordinate,
    gps2: GPSCoordinate
  ): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (gps2.latitude - gps1.latitude) * (Math.PI / 180);
    const dLon = (gps2.longitude - gps1.longitude) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(gps1.latitude * (Math.PI / 180)) *
        Math.cos(gps2.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
```

---

### 3.3 Crear Hook `useCoordinateProjection`
- [ ] Crear archivo `src/hooks/useCoordinateProjection.ts`
- [ ] Instanciar `CoordinateProjection` con bounds
- [ ] Exportar métodos de conversión

**Archivo:** `src/hooks/useCoordinateProjection.ts`

```typescript
import { useMemo } from 'react';
import { CoordinateProjection } from '@/utils/CoordinateProjection';
import type { Bounds } from '@/types';
import type { SVGBounds } from '@/types/projection';

export const useCoordinateProjection = (
  gpsBounds: Bounds,
  svgBounds: SVGBounds
) => {
  const projection = useMemo(
    () => new CoordinateProjection(gpsBounds, svgBounds),
    [gpsBounds, svgBounds]
  );

  return projection;
};
```

---

### 3.4 Crear Hook `useLocationProjection`
- [ ] Crear archivo `src/hooks/useLocationProjection.ts`
- [ ] Proyectar marcadores desde GPS a SVG
- [ ] Usable para renderizar marcadores dinámicos

**Archivo:** `src/hooks/useLocationProjection.ts`

```typescript
import { useMemo } from 'react';
import { useCoordinateProjection } from './useCoordinateProjection';
import type { Marker } from '@/types';
import type { Bounds } from '@/types';
import type { SVGBounds, SVGCoordinate } from '@/types/projection';

export const useLocationProjection = (
  markers: Marker[] | undefined,
  gpsBounds: Bounds,
  svgBounds: SVGBounds
) => {
  const projection = useCoordinateProjection(gpsBounds, svgBounds);

  const projectedMarkers = useMemo(() => {
    if (!markers) return [];

    return markers.map((marker) => ({
      ...marker,
      svgCoordinate: projection.gpsToSvg({
        latitude: marker.latitude,
        longitude: marker.longitude,
      }),
    }));
  }, [markers, projection]);

  return projectedMarkers;
};
```

---

### 3.5 Crear Componente `ProjectedSVGMap`
- [ ] Crear archivo `src/components/ProjectedSVGMap.tsx`
- [ ] Extender `InteractiveSVGMap` con proyección
- [ ] Renderizar marcadores proyectados (como círculos o pins)
- [ ] Mostrar información de coordenadas (debug)

**Archivo:** `src/components/ProjectedSVGMap.tsx`

```typescript
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { InteractiveSVGMap } from './InteractiveSVGMap';
import { useLocationProjection } from '@/hooks/useLocationProjection';
import type { SVGMapProps } from '@/types';
import type { SVGBounds } from '@/types/projection';

interface ProjectedSVGMapProps extends SVGMapProps {
  svgBounds: SVGBounds;
}

export const ProjectedSVGMap: React.FC<ProjectedSVGMapProps> = ({
  svgBounds,
  ...props
}) => {
  const projectedMarkers = useLocationProjection(
    props.markers,
    props.bounds,
    svgBounds
  );

  return (
    <View style={styles.container}>
      <InteractiveSVGMap {...props}>
        {/* Markers will be rendered here */}
        {projectedMarkers.map((marker) => (
          <Circle
            key={marker.id}
            cx={marker.svgCoordinate.x}
            cy={marker.svgCoordinate.y}
            r="8"
            fill="#ff6b6b"
            stroke="#fff"
            strokeWidth="2"
          />
        ))}
      </InteractiveSVGMap>

      {/* Debug info */}
      {projectedMarkers.length > 0 && (
        <View style={styles.debugBox}>
          <Text style={styles.debugText}>
            Markers proyectados: {projectedMarkers.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  debugBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
  },
});
```

---

### 3.6 Actualizar Tipos Base
- [ ] Actualizar `src/types/index.ts` para incluir las nuevas interfaces
- [ ] Agregar `export` de `src/types/projection.ts`

---

### 3.7 Actualizar Componente de Ejemplo
- [ ] Actualizar `src/components/SampleSVGMap.tsx`
- [ ] Agregar marcadores con coordenadas GPS
- [ ] Cambiar de `InteractiveSVGMap` a `ProjectedSVGMap`
- [ ] Definir `SVGBounds` apropiadamente (800x600 en este caso)

**Referencia:**
```typescript
const SVG_BOUNDS: SVGBounds = {
  top: 0,
  left: 0,
  right: 800,
  bottom: 600,
  width: 800,
  height: 600,
};

const MARKERS: Marker[] = [
  {
    id: 'user1',
    latitude: 15.5010,
    longitude: -88.0223,
  },
  {
    id: 'user2',
    latitude: 15.5015,
    longitude: -88.0225,
  },
];
```

---

## ✅ Checklist de Validación

Antes de pasar a Fase 4, verifica:

- [ ] `src/types/projection.ts` define las interfaces de proyección
- [ ] `src/utils/CoordinateProjection.ts` convierte correctamente GPS ↔ SVG
- [ ] `src/hooks/useCoordinateProjection.ts` existe
- [ ] `src/hooks/useLocationProjection.ts` proyecta marcadores correctamente
- [ ] `src/components/ProjectedSVGMap.tsx` renderiza marcadores
- [ ] Ejecutar `npm start` muestra marcadores en pantalla
- [ ] Los marcadores se proyectan en las coordenadas correctas
- [ ] TypeScript no muestra errores (`npx tsc --noEmit`)

---

## 🧪 Pruebas Manuales

1. **Ejecutar la app:**
   ```bash
   npm start
   ```

2. **Verificar proyección:**
   - Los marcadores deben aparecer en puntos específicos del SVG
   - Cambiar los bounds GPS debe cambiar posición de marcadores
   - Zoom y pan deben funcionar correctamente

3. **Verificar cálculos:**
   - Usa console.log para validar conversiones
   - Verifica que `gpsToSvg` y `svgToGps` son inversas

---

## 📝 Notas Importantes

- **Proyección Simplificada:** Usamos una proyección rectangular simple, no Mercator completo
- **Bounds:** GPS tiene convención N/S/E/W; SVG tiene coordenadas cartesianas
- **Precisión:** Para aplicaciones reales, considera geospatial libraries como `geolib`
- **SVGBounds:** Define los límites del área visible en el SVG

---

## 🔗 Próximo Paso

Una vez completada esta fase, ve a `docs/PHASE-04-marker-layer.md` para agregar renderización dinámica de marcadores.

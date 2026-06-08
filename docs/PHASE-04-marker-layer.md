# Fase 4: Marker Layer - Renderización Dinámica de Marcadores

**Estado:** 🔲 No iniciado  
**Duración estimada:** 1-2 días  
**Dependencias:** Fase 1 (SVG Layer) ✅, Fase 3 (Projection Layer) ✅

---

## 📌 Objetivo

Crear un sistema robusto de marcadores en tiempo real con diferentes tipos (usuario actual, runners, ubicaciones dinámicas) y animaciones suaves.

---

## 🎯 Tareas

### 4.1 Crear Tipos de Marcadores
- [ ] Crear archivo `src/types/markers.ts`
- [ ] Definir interfaz `BaseMarker`
- [ ] Definir tipo `MarkerType` (enum): 'user', 'runner', 'location', 'custom'
- [ ] Definir interfaz extendida `DynamicMarker`

**Archivo:** `src/types/markers.ts`

```typescript
export enum MarkerType {
  USER = 'user',
  RUNNER = 'runner',
  LOCATION = 'location',
  CUSTOM = 'custom',
}

export interface BaseMarker {
  id: string;
  latitude: number;
  longitude: number;
}

export interface DynamicMarker extends BaseMarker {
  type: MarkerType;
  label?: string;
  color?: string;
  size?: number;
  rotation?: number; // Para direccionalidad
  isAnimating?: boolean;
}

export interface MarkerStyle {
  fillColor: string;
  strokeColor: string;
  radius: number;
  strokeWidth: number;
}

export const MARKER_STYLES: Record<MarkerType, MarkerStyle> = {
  [MarkerType.USER]: {
    fillColor: '#4285F4',
    strokeColor: '#fff',
    radius: 12,
    strokeWidth: 2,
  },
  [MarkerType.RUNNER]: {
    fillColor: '#EA4335',
    strokeColor: '#fff',
    radius: 10,
    strokeWidth: 2,
  },
  [MarkerType.LOCATION]: {
    fillColor: '#FBBC04',
    strokeColor: '#fff',
    radius: 8,
    strokeWidth: 1,
  },
  [MarkerType.CUSTOM]: {
    fillColor: '#34A853',
    strokeColor: '#fff',
    radius: 10,
    strokeWidth: 2,
  },
};
```

---

### 4.2 Crear Componente `MarkerIcon`
- [ ] Crear archivo `src/components/MarkerIcon.tsx`
- [ ] Renderizar círculos con estilos según tipo
- [ ] Agregar animación de pulso para usuario actual
- [ ] Agregar soporte para labels

**Archivo:** `src/components/MarkerIcon.tsx`

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Text } from 'react-native-svg';
import type { DynamicMarker, MarkerType } from '@/types/markers';
import { MARKER_STYLES } from '@/types/markers';

interface MarkerIconProps {
  marker: DynamicMarker;
  x: number;
  y: number;
}

export const MarkerIcon: React.FC<MarkerIconProps> = ({
  marker,
  x,
  y,
}) => {
  const style = MARKER_STYLES[marker.type];
  const scale = useSharedValue(1);

  // Animación de pulso para usuario actual
  React.useEffect(() => {
    if (marker.type === 'user' && marker.isAnimating) {
      scale.value = withRepeat(
        withTiming(1.2, { duration: 1000 }),
        -1,
        true
      );
    }
  }, [marker.isAnimating, marker.type, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: x - style.radius,
          top: y - style.radius,
        },
        animatedStyle,
      ]}
    >
      <Svg width={style.radius * 2} height={style.radius * 2}>
        <Circle
          cx={style.radius}
          cy={style.radius}
          r={style.radius}
          fill={marker.color || style.fillColor}
          stroke={style.strokeColor}
          strokeWidth={style.strokeWidth}
        />
        {marker.label && (
          <Text
            x={style.radius}
            y={style.radius + 4}
            fontSize="10"
            fill="#fff"
            textAnchor="middle"
            fontWeight="bold"
          >
            {marker.label.charAt(0).toUpperCase()}
          </Text>
        )}
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
```

---

### 4.3 Crear Hook `useMarkerAnimation`
- [ ] Crear archivo `src/hooks/useMarkerAnimation.ts`
- [ ] Manejar animaciones de entrada/salida de marcadores
- [ ] Manejar interpolación de movimiento suave
- [ ] Usar Reanimated para performance

**Archivo:** `src/hooks/useMarkerAnimation.ts`

```typescript
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export const useMarkerAnimation = (initialX: number, initialY: number) => {
  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);
  const opacity = useSharedValue(1);

  const updatePosition = (newX: number, newY: number) => {
    x.value = withSpring(newX);
    y.value = withSpring(newY);
  };

  const fadeIn = () => {
    opacity.value = withSpring(1);
  };

  const fadeOut = () => {
    opacity.value = withSpring(0);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    opacity: opacity.value,
  }));

  return {
    x,
    y,
    opacity,
    updatePosition,
    fadeIn,
    fadeOut,
    animatedStyle,
  };
};
```

---

### 4.4 Crear Componente `MarkerLayer`
- [ ] Crear archivo `src/components/MarkerLayer.tsx`
- [ ] Renderizar todos los marcadores
- [ ] Manejar animaciones de entrada/salida
- [ ] Optimizar con memoización

**Archivo:** `src/components/MarkerLayer.tsx`

```typescript
import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { MarkerIcon } from './MarkerIcon';
import { useLocationProjection } from '@/hooks/useLocationProjection';
import type { DynamicMarker } from '@/types/markers';
import type { Bounds } from '@/types';
import type { SVGBounds } from '@/types/projection';

interface MarkerLayerProps {
  markers: DynamicMarker[];
  gpsBounds: Bounds;
  svgBounds: SVGBounds;
  onMarkerPress?: (marker: DynamicMarker) => void;
}

export const MarkerLayer: React.FC<MarkerLayerProps> = ({
  markers,
  gpsBounds,
  svgBounds,
  onMarkerPress,
}) => {
  const projectedMarkers = useLocationProjection(
    markers,
    gpsBounds,
    svgBounds
  );

  const handleMarkerPress = useCallback(
    (marker: DynamicMarker) => {
      onMarkerPress?.(marker);
    },
    [onMarkerPress]
  );

  return (
    <View style={styles.container} pointerEvents="none">
      {projectedMarkers.map((marker: any) => (
        <MarkerIcon
          key={marker.id}
          marker={marker}
          x={marker.svgCoordinate.x}
          y={marker.svgCoordinate.y}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
```

---

### 4.5 Crear Componente `DynamicSVGMap`
- [ ] Crear archivo `src/components/DynamicSVGMap.tsx`
- [ ] Integrar `InteractiveSVGMap` + `MarkerLayer`
- [ ] Manejar transiciones suaves de marcadores
- [ ] Soportar actualización en tiempo real

**Archivo:** `src/components/DynamicSVGMap.tsx`

```typescript
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { InteractiveSVGMap } from './InteractiveSVGMap';
import { MarkerLayer } from './MarkerLayer';
import type { SVGMapProps } from '@/types';
import type { SVGBounds } from '@/types/projection';
import type { DynamicMarker } from '@/types/markers';

interface DynamicSVGMapProps extends SVGMapProps {
  svgBounds: SVGBounds;
  dynamicMarkers?: DynamicMarker[];
  onMarkerPress?: (marker: DynamicMarker) => void;
}

export const DynamicSVGMap: React.FC<DynamicSVGMapProps> = ({
  svgBounds,
  dynamicMarkers = [],
  onMarkerPress,
  ...props
}) => {
  const handleMarkerPress = useCallback(
    (marker: DynamicMarker) => {
      console.log(`Marcador presionado: ${marker.id}`);
      onMarkerPress?.(marker);
    },
    [onMarkerPress]
  );

  return (
    <View style={styles.container}>
      <InteractiveSVGMap {...props} />
      <MarkerLayer
        markers={dynamicMarkers}
        gpsBounds={props.bounds}
        svgBounds={svgBounds}
        onMarkerPress={handleMarkerPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
```

---

### 4.6 Crear Componente de Ejemplo Avanzado
- [ ] Actualizar `src/components/SampleSVGMap.tsx`
- [ ] Cambiar a `DynamicSVGMap`
- [ ] Agregar marcadores de diferentes tipos
- [ ] Simular actualización en tiempo real (con setTimeout)

**Referencia:**
```typescript
const DYNAMIC_MARKERS: DynamicMarker[] = [
  {
    id: 'user-current',
    latitude: 15.5010,
    longitude: -88.0223,
    type: MarkerType.USER,
    label: 'Yo',
    isAnimating: true,
  },
  {
    id: 'runner-1',
    latitude: 15.5015,
    longitude: -88.0225,
    type: MarkerType.RUNNER,
    label: 'J',
  },
  {
    id: 'location-cafe',
    latitude: 15.5008,
    longitude: -88.0220,
    type: MarkerType.LOCATION,
    label: 'C',
  },
];
```

---

### 4.7 Actualizar App.tsx
- [ ] Asegurar que renderiza correctamente
- [ ] Probar animaciones de marcadores
- [ ] Verificar que funcionan con zoom y pan

---

## ✅ Checklist de Validación

Antes de pasar a Fase 5, verifica:

- [ ] `src/types/markers.ts` define tipos y estilos
- [ ] `src/components/MarkerIcon.tsx` renderiza correctamente
- [ ] `src/hooks/useMarkerAnimation.ts` existe
- [ ] `src/components/MarkerLayer.tsx` renderiza todos los marcadores
- [ ] `src/components/DynamicSVGMap.tsx` integra todo
- [ ] Ejecutar `npm start` muestra marcadores animados
- [ ] Zoom y pan funcionan con marcadores visibles
- [ ] Usuario actual tiene animación de pulso
- [ ] TypeScript sin errores (`npx tsc --noEmit`)

---

## 🧪 Pruebas Manuales

1. **Ejecutar la app:**
   ```bash
   npm start
   ```

2. **Verificar marcadores:**
   - Deben verse 3+ marcadores en pantalla
   - Usuario actual (azul) debe tener animación de pulso
   - Runners (rojos) deben estar visibles
   - Ubicaciones (amarillas) deben estar visibles

3. **Verificar animaciones:**
   - Al hacer zoom, marcadores deben escalarse
   - Al hacer pan, marcadores deben moverse
   - Animación de pulso debe ser suave

4. **Performance:**
   - Agregar +20 marcadores
   - Verificar que no hay lag

---

## 📝 Notas Importantes

- **Reanimated Performance:** Usa Shared Values para no re-renderizar
- **MarkerIcon Optimización:** Considera `React.memo` para marcadores estáticos
- **Animation Smoothness:** Spring animations para movimiento natural
- **Opacity vs Hidden:** Usa opacity en lugar de conditional rendering

---

## 🔗 Próximo Paso

Una vez completada esta fase, ve a `docs/PHASE-05-location-layer.md` para agregar interactividad con elementos SVG específicos.

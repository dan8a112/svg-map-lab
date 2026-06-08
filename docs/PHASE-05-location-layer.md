# Fase 5: Location Layer - Entidades del Mapa e Interactividad

**Estado:** 🔲 No iniciado  
**Duración estimada:** 1-2 días  
**Dependencias:** Todas las fases anteriores ✅

---

## 📌 Objetivo

Crear un sistema completo de entidades del mapa (locations) que permite interactuar con elementos SVG específicos, mostrar información detallada y manejar eventos.

---

## 🎯 Tareas

### 5.1 Crear Tipos de Ubicaciones
- [ ] Crear archivo `src/types/locations.ts`
- [ ] Definir interfaz `SVGLocation`
- [ ] Definir interfaz `LocationDetails`
- [ ] Definir interfaz `LocationEvent`

**Archivo:** `src/types/locations.ts`

```typescript
import type { Bounds } from './index';

export enum LocationCategory {
  BUILDING = 'building',
  SERVICE = 'service',
  OUTDOOR = 'outdoor',
  TRANSPORT = 'transport',
  CUSTOM = 'custom',
}

export interface SVGLocation {
  id: string;
  name: string;
  svgElementId: string; // ID del elemento en el SVG
  category?: LocationCategory;
  description?: string;
  metadata?: Record<string, any>;
}

export interface LocationDetails extends SVGLocation {
  // Información completa
  image?: string;
  address?: string;
  phone?: string;
  hours?: string;
  features?: string[];
  capacity?: number;
  floor?: number;
}

export interface LocationEvent {
  type: 'enter' | 'exit' | 'press' | 'hover';
  location: SVGLocation;
  timestamp: number;
}

export interface LocationState {
  selected?: string; // ID de location seleccionada
  highlighted?: string; // ID de location resaltada (hover)
  nearby?: string[]; // IDs de locations cercanas
}
```

---

### 5.2 Crear Componente `LocationHighlight`
- [ ] Crear archivo `src/components/LocationHighlight.tsx`
- [ ] Renderizar resaltes sobre elementos SVG
- [ ] Animar entrada/salida de resaltes
- [ ] Mostrar información del elemento

**Archivo:** `src/components/LocationHighlight.tsx`

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { SVGLocation } from '@/types/locations';

interface LocationHighlightProps {
  location: SVGLocation;
  isSelected?: boolean;
  isHighlighted?: boolean;
  onPress?: () => void;
}

export const LocationHighlight: React.FC<LocationHighlightProps> = ({
  location,
  isSelected = false,
  isHighlighted = false,
  onPress,
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  React.useEffect(() => {
    if (isSelected || isHighlighted) {
      opacity.value = withSpring(1);
      scale.value = withSpring(1);
    } else {
      opacity.value = withSpring(0);
      scale.value = withSpring(0.8);
    }
  }, [isSelected, isHighlighted, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const borderColor = isSelected ? '#FF6B6B' : '#FFC107';
  const borderWidth = isSelected ? 3 : 2;

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        {
          borderColor,
          borderWidth,
        },
      ]}
      onTouchEnd={onPress}
    >
      <View style={styles.label}>
        <Text style={styles.labelText}>{location.name}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: 8,
    justifyContent: 'flex-end',
    paddingBottom: 4,
    alignItems: 'center',
  },
  label: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  labelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
```

---

### 5.3 Crear Hook `useLocationState`
- [ ] Crear archivo `src/hooks/useLocationState.ts`
- [ ] Manejar estado de locations (seleccionada, resaltada, cercanas)
- [ ] Manejar transiciones de estado
- [ ] Exportar funciones de actualización

**Archivo:** `src/hooks/useLocationState.ts`

```typescript
import { useState, useCallback } from 'react';
import type { LocationState, SVGLocation } from '@/types/locations';

export const useLocationState = () => {
  const [state, setState] = useState<LocationState>({
    selected: undefined,
    highlighted: undefined,
    nearby: [],
  });

  const selectLocation = useCallback((locationId: string | undefined) => {
    setState((prev) => ({
      ...prev,
      selected: locationId,
    }));
  }, []);

  const highlightLocation = useCallback((locationId: string | undefined) => {
    setState((prev) => ({
      ...prev,
      highlighted: locationId,
    }));
  }, []);

  const setNearbyLocations = useCallback((locationIds: string[]) => {
    setState((prev) => ({
      ...prev,
      nearby: locationIds,
    }));
  }, []);

  const clearState = useCallback(() => {
    setState({
      selected: undefined,
      highlighted: undefined,
      nearby: [],
    });
  }, []);

  return {
    state,
    selectLocation,
    highlightLocation,
    setNearbyLocations,
    clearState,
  };
};
```

---

### 5.4 Crear Hook `useLocationProximity`
- [ ] Crear archivo `src/hooks/useLocationProximity.ts`
- [ ] Calcular locations cercanas a un punto
- [ ] Usar `CoordinateProjection` para distancias
- [ ] Umbral configurable de proximidad

**Archivo:** `src/hooks/useLocationProximity.ts`

```typescript
import { useMemo } from 'react';
import { CoordinateProjection } from '@/utils/CoordinateProjection';
import type { SVGLocation } from '@/types/locations';
import type { Bounds } from '@/types';
import type { SVGBounds, GPSCoordinate } from '@/types/projection';

export const useLocationProximity = (
  locations: SVGLocation[],
  userGPS: GPSCoordinate | undefined,
  gpsBounds: Bounds,
  proximityRadius: number = 0.1 // km
) => {
  const nearbyLocations = useMemo(() => {
    if (!userGPS || !locations) return [];

    const projection = new CoordinateProjection(gpsBounds, {
      top: 0,
      left: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
    });

    return locations.filter((location) => {
      // Para esta implementación, creamos un proxy GPS para cada location
      // En producción, necesitarías coordenadas GPS para cada location
      const distance = projection.distanceBetweenGPS(
        userGPS,
        { latitude: userGPS.latitude, longitude: userGPS.longitude }
      );

      return distance <= proximityRadius;
    });
  }, [locations, userGPS, gpsBounds, proximityRadius]);

  return nearbyLocations;
};
```

---

### 5.5 Crear Componente `LocationLayer`
- [ ] Crear archivo `src/components/LocationLayer.tsx`
- [ ] Renderizar todas las locations
- [ ] Manejar selección y resalte
- [ ] Mostrar información cuando se selecciona

**Archivo:** `src/components/LocationLayer.tsx`

```typescript
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useLocationState } from '@/hooks/useLocationState';
import { LocationHighlight } from './LocationHighlight';
import type { SVGLocation, LocationDetails } from '@/types/locations';

interface LocationLayerProps {
  locations: SVGLocation[];
  locationDetails?: Record<string, LocationDetails>;
  onLocationSelected?: (location: SVGLocation) => void;
  onLocationPress?: (location: SVGLocation) => void;
}

export const LocationLayer: React.FC<LocationLayerProps> = ({
  locations,
  locationDetails = {},
  onLocationSelected,
  onLocationPress,
}) => {
  const { state, selectLocation, highlightLocation } = useLocationState();

  const handleLocationPress = useCallback(
    (location: SVGLocation) => {
      selectLocation(location.id);
      onLocationSelected?.(location);
      onLocationPress?.(location);
    },
    [selectLocation, onLocationSelected, onLocationPress]
  );

  const handleLocationHover = useCallback(
    (location: SVGLocation) => {
      highlightLocation(location.id);
    },
    [highlightLocation]
  );

  const selectedLocationDetails = state.selected
    ? locationDetails[state.selected]
    : undefined;

  return (
    <View style={styles.container}>
      {/* Highlights de locations */}
      <View style={styles.highlightLayer} pointerEvents="none">
        {locations.map((location) => (
          <LocationHighlight
            key={location.id}
            location={location}
            isSelected={state.selected === location.id}
            isHighlighted={state.highlighted === location.id}
            onPress={() => handleLocationPress(location)}
          />
        ))}
      </View>

      {/* Info panel cuando está seleccionada una location */}
      {selectedLocationDetails && (
        <View style={styles.infoPanel}>
          <Text style={styles.infoTitle}>{selectedLocationDetails.name}</Text>
          {selectedLocationDetails.description && (
            <Text style={styles.infoDescription}>
              {selectedLocationDetails.description}
            </Text>
          )}
          {selectedLocationDetails.features && (
            <ScrollView style={styles.featuresList} horizontal>
              {selectedLocationDetails.features.map((feature, idx) => (
                <Text key={idx} style={styles.featureTag}>
                  {feature}
                </Text>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  highlightLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  featuresList: {
    flexDirection: 'row',
  },
  featureTag: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    fontSize: 12,
    fontWeight: '600',
  },
});
```

---

### 5.6 Crear Componente `CompleteSVGMap`
- [ ] Crear archivo `src/components/CompleteSVGMap.tsx`
- [ ] Integrar todos los componentes: Interacción + Proyección + Marcadores + Locations
- [ ] Componente final y completo

**Archivo:** `src/components/CompleteSVGMap.tsx`

```typescript
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { DynamicSVGMap } from './DynamicSVGMap';
import { LocationLayer } from './LocationLayer';
import type { SVGMapProps } from '@/types';
import type { SVGBounds } from '@/types/projection';
import type { DynamicMarker } from '@/types/markers';
import type { SVGLocation, LocationDetails } from '@/types/locations';

interface CompleteSVGMapProps extends SVGMapProps {
  svgBounds: SVGBounds;
  dynamicMarkers?: DynamicMarker[];
  locations?: SVGLocation[];
  locationDetails?: Record<string, LocationDetails>;
  onMarkerPress?: (marker: DynamicMarker) => void;
  onLocationPress?: (location: SVGLocation) => void;
}

export const CompleteSVGMap: React.FC<CompleteSVGMapProps> = ({
  svgBounds,
  dynamicMarkers = [],
  locations = [],
  locationDetails = {},
  onMarkerPress,
  onLocationPress,
  ...props
}) => {
  const handleMarkerPress = useCallback(
    (marker: DynamicMarker) => {
      console.log(`Marcador: ${marker.id}`);
      onMarkerPress?.(marker);
    },
    [onMarkerPress]
  );

  const handleLocationPress = useCallback(
    (location: SVGLocation) => {
      console.log(`Ubicación: ${location.id}`);
      onLocationPress?.(location);
    },
    [onLocationPress]
  );

  return (
    <View style={styles.container}>
      <DynamicSVGMap
        {...props}
        svgBounds={svgBounds}
        dynamicMarkers={dynamicMarkers}
        onMarkerPress={handleMarkerPress}
      />
      <LocationLayer
        locations={locations}
        locationDetails={locationDetails}
        onLocationPress={handleLocationPress}
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

### 5.7 Crear Ejemplo Completo
- [ ] Actualizar `src/components/SampleSVGMap.tsx`
- [ ] Cambiar a `CompleteSVGMap`
- [ ] Agregar locations con detalles
- [ ] Agregar marcadores dinámicos
- [ ] Demostración completa del sistema

**Referencia:**
```typescript
const LOCATIONS_DETAILS: Record<string, LocationDetails> = {
  admin: {
    id: 'admin',
    name: 'Administración',
    svgElementId: 'admin',
    description: 'Oficinas administrativas del campus',
    features: ['WiFi', 'Parking', 'ATM'],
    hours: '8:00 - 17:00',
  },
  // ... más locations
};
```

---

### 5.8 Exportar Componentes Públicos
- [ ] Actualizar `src/components/index.ts` (crear si no existe)
- [ ] Exportar `CompleteSVGMap` como componente principal
- [ ] Exportar tipos necesarios desde `src/types/`

**Archivo:** `src/components/index.ts`

```typescript
export { CompleteSVGMap } from './CompleteSVGMap';
export { DynamicSVGMap } from './DynamicSVGMap';
export { InteractiveSVGMap } from './InteractiveSVGMap';
export { SVGMap } from './SVGMap';
export { LocationLayer } from './LocationLayer';
export { MarkerLayer } from './MarkerLayer';
export { MarkerIcon } from './MarkerIcon';
```

---

### 5.9 Crear Barril de Tipos
- [ ] Crear `src/types/index.ts` consolidado (si no existe)
- [ ] Exportar todos los tipos desde módulos individuales

**Archivo:** `src/types/index.ts` (actualizado)

```typescript
// Core types
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

// Re-exports
export type * from './projection';
export type * from './markers';
export type * from './locations';
```

---

### 5.10 Actualizar App.tsx
- [ ] Importar `CompleteSVGMap`
- [ ] Renderizar con todas las características
- [ ] Prueba completa del sistema

---

## ✅ Checklist de Validación

Antes de finalizar, verifica:

- [ ] `src/types/locations.ts` define tipos de ubicaciones
- [ ] `src/components/LocationHighlight.tsx` renderiza resaltes
- [ ] `src/hooks/useLocationState.ts` existe
- [ ] `src/hooks/useLocationProximity.ts` calcula proximidad
- [ ] `src/components/LocationLayer.tsx` renderiza locations
- [ ] `src/components/CompleteSVGMap.tsx` integra todo
- [ ] `src/components/index.ts` exporta componentes públicos
- [ ] Ejecutar `npm start` muestra sistema completo funcionando
- [ ] Zoom, pan, marcadores y locations funcionan juntos
- [ ] Info panel aparece al seleccionar locations
- [ ] TypeScript sin errores (`npx tsc --noEmit`)

---

## 🧪 Pruebas Finales

1. **Ejecución:**
   ```bash
   npm start
   ```

2. **Verificar todas las capas:**
   - ✅ Mapa SVG renderizado
   - ✅ Zoom (pinch) funciona
   - ✅ Pan (drag) funciona
   - ✅ Marcadores visibles y animados
   - ✅ Locations marcadas
   - ✅ Presionar location muestra info
   - ✅ Info panel funciona

3. **Performance:**
   - Agregar 50+ marcadores
   - Agregar 20+ locations
   - Verificar que todo es suave

4. **TypeScript:**
   ```bash
   npx tsc --noEmit
   ```

---

## 📝 Notas Importantes

- **Arquitectura Completa:** Todas las capas trabajan juntas
- **Escalabilidad:** Preparado para 100+ marcadores
- **Interactividad:** Full zoom, pan, tap y selección
- **Animaciones:** Suaves y performantes con Reanimated

---

## 🎉 ¡Proyecto Completado!

Una vez completada esta fase, tienes un sistema completo de mapas interactivos en React Native.

### Próximos Pasos Opcionales:

1. **Persistencia:** Agregar AsyncStorage para guardar preferencias
2. **Real-time:** Integrar WebSocket para tracking en vivo
3. **Routing:** Agregar navegación entre locations
4. **Offline:** Descargar SVG y datos para uso offline
5. **Librería:** Desacoplar en paquete NPM reutilizable

---

## 📋 Resumen de Arquitectura Final

```
┌──────────────────────────────────┐
│     CompleteSVGMap               │ ← Componente principal
├──────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ DynamicSVGMap             │  │ ← Mapa + Marcadores
│ │ ├─ InteractiveSVGMap      │  │
│ │ ├─ MarkerLayer            │  │
│ │ └─ useLocationProjection  │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ LocationLayer             │  │ ← Ubicaciones + Info
│ │ ├─ LocationHighlight      │  │
│ │ ├─ useLocationState       │  │
│ │ └─ LocationDetails Panel  │  │
│ └────────────────────────────┘  │
└──────────────────────────────────┘
```

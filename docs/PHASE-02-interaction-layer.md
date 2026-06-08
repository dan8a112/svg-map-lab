# Fase 2: Interaction Layer - Zoom, Pan y Gestos

**Estado:** 🔲 No iniciado  
**Duración estimada:** 2-3 días  
**Dependencias:** Fase 1 (SVG Layer) ✅

---

## 📌 Objetivo

Agregar interactividad al mapa SVG: zoom (pinch), pan (drag) y detección de toques en elementos.

---

## 🎯 Tareas

### 2.1 Instalar React Native Gesture Handler
- [ ] Instalar `react-native-gesture-handler`
- [ ] Instalar `react-native-reanimated`
- [ ] Verificar que Expo está configurado para usar estas librerías

**Comando:**
```bash
npm install react-native-gesture-handler react-native-reanimated
```

**Referencia:** AGENTS.md menciona `vercel-react-native-skills` que incluye reglas para animaciones y gestos.

---

### 2.2 Crear Hook `useMapTransform`
- [ ] Crear archivo `src/hooks/useMapTransform.ts`
- [ ] Manejar estado de zoom (scale)
- [ ] Manejar estado de pan (translateX, translateY)
- [ ] Exportar funciones para actualizar ambos valores

**Archivo:** `src/hooks/useMapTransform.ts`

```typescript
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
```

---

### 2.3 Crear Componente `InteractiveSVGMap`
- [ ] Crear archivo `src/components/InteractiveSVGMap.tsx`
- [ ] Envolver SVG en Animated.View
- [ ] Implementar PinchGestureHandler para zoom
- [ ] Implementar PanGestureHandler para pan
- [ ] Agregar límites mínimos y máximos de zoom

**Archivo:** `src/components/InteractiveSVGMap.tsx`

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import {
  PinchGestureHandler,
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Svg from 'react-native-svg';
import { useMapTransform } from '@/hooks/useMapTransform';
import type { SVGMapProps } from '@/types';

const MIN_SCALE = 1;
const MAX_SCALE = 5;

export const InteractiveSVGMap: React.FC<SVGMapProps> = ({
  svgString,
  bounds,
  locations = [],
  markers = [],
  onLocationPress,
  onMarkerPress,
}) => {
  const { scale, translateX, translateY, reset } = useMapTransform();

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, event.scale));
      scale.value = newScale;
    },
    onEnd: () => {
      if (scale.value < MIN_SCALE) {
        scale.value = withSpring(MIN_SCALE);
      } else if (scale.value > MAX_SCALE) {
        scale.value = withSpring(MAX_SCALE);
      }
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.mapContainer}>
        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.View style={[styles.content, animatedStyle]}>
            <PanGestureHandler onGestureEvent={panHandler}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 800 600"
              >
                {/* SVG content will be rendered here */}
              </Svg>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});
```

---

### 2.4 Crear Hook `useTapDetection`
- [ ] Crear archivo `src/hooks/useTapDetection.ts`
- [ ] Detectar toques en elementos SVG específicos
- [ ] Llamar callbacks `onLocationPress` o `onMarkerPress`

**Archivo:** `src/hooks/useTapDetection.ts`

```typescript
import { useCallback } from 'react';
import type { Location, Marker } from '@/types';

export const useTapDetection = (
  locations?: Location[],
  markers?: Marker[],
  onLocationPress?: (location: Location) => void,
  onMarkerPress?: (marker: Marker) => void,
) => {
  const handleSVGPress = useCallback(
    (event: any) => {
      const target = event.nativeEvent.target;
      
      // Buscar en locations
      if (locations && onLocationPress) {
        const location = locations.find(
          (loc) => loc.svgElementId === target.id
        );
        if (location) {
          onLocationPress(location);
        }
      }

      // Buscar en markers
      if (markers && onMarkerPress) {
        const marker = markers.find(
          (m) => m.id === target.id
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
```

---

### 2.5 Actualizar Componente de Ejemplo
- [ ] Actualizar `src/components/SampleSVGMap.tsx`
- [ ] Cambiar de `SVGMap` a `InteractiveSVGMap`
- [ ] Agregar console.log o toast en `onLocationPress` y `onMarkerPress`

**Referencia:** Verifica que funciona con `npm start`

---

### 2.6 Actualizar App.tsx
- [ ] Asegurar que renderiza correctamente
- [ ] Probar pinch (zoom) en el simulador
- [ ] Probar drag (pan) en el simulador

---

## ✅ Checklist de Validación

Antes de pasar a Fase 3, verifica:

- [ ] `react-native-gesture-handler` está instalado
- [ ] `react-native-reanimated` está instalado
- [ ] `src/hooks/useMapTransform.ts` existe y funciona
- [ ] `src/components/InteractiveSVGMap.tsx` renderiza sin errores
- [ ] `src/hooks/useTapDetection.ts` detecta toques (verificar en console)
- [ ] Ejecutar `npm start` muestra la app sin errores
- [ ] Zoom (pinch) funciona en el simulador
- [ ] Pan (drag) funciona en el simulador
- [ ] Se pueden tocar elementos SVG (verificar con console.log)

---

## 🧪 Pruebas Manuales

1. **Ejecutar la app:**
   ```bash
   npm start
   # Elige tu plataforma
   ```

2. **Probar Zoom:**
   - En simulador iOS: Cmd+Option para pinch
   - En simulador Android: Ctrl para pinch
   - El mapa debe crecer y achicarse suavemente
   - El zoom debe limitar entre 1x y 5x

3. **Probar Pan:**
   - Arrastra el mapa con un dedo
   - El mapa debe moverse en la dirección del arrastre
   - Debe funcionr con zoom aplicado

4. **Probar Tap Detection:**
   - Abre la consola (npm start mostró URL de debug)
   - Toca elementos del SVG
   - Verifica console.log o toast

---

## 📝 Notas Importantes

- **Reanimated 3:** La sintaxis es con Shared Values (v3.0+)
- **GestureHandler:** Envuelve con `GestureHandlerRootView`
- **Performance:** Usa Animated values para evitar re-renders
- **Límites:** MIN_SCALE = 1, MAX_SCALE = 5 (ajusta si es necesario)

---

## 🔗 Próximo Paso

Una vez completada esta fase, ve a `docs/PHASE-03-projection-layer.md` para agregar conversión de coordenadas GPS.

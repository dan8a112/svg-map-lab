# Fase 1: SVG Layer - Configuración Base y Renderización

**Estado:** ✅ Completada  
**Duración estimada:** 1-2 días  
**Dependencias:** Ninguna

---

## 📌 Objetivo

Establecer la estructura base del proyecto y crear un componente que renderice mapas SVG en React Native.

---

## 🎯 Tareas

### 1.1 Crear Estructura de Carpetas
- [ ] Crear carpeta `src/` en la raíz del proyecto
- [ ] Crear `src/components/` para componentes
- [ ] Crear `src/types/` para tipos TypeScript
- [ ] Crear `src/utils/` para utilidades
- [ ] Crear `src/hooks/` para hooks custom
- [ ] Crear `src/constants/` para constantes

**Comando:**
```bash
mkdir -p src/{components,types,utils,hooks,constants}
```

---

### 1.2 Definir Tipos Base
- [ ] Crear `src/types/index.ts`
- [ ] Definir interfaz `Location`
- [ ] Definir interfaz `Bounds`
- [ ] Definir interfaz `SVGMapProps`
- [ ] Definir interfaz `Marker`

**Archivo:** `src/types/index.ts`

```typescript
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
```

**Referencia:** `AGENTS.md` menciona que TypeScript está en strict mode.

---

### 1.3 Crear Componente SVGMap Básico
- [x] Crear archivo `src/components/SVGMap.tsx`
- [x] Implementar renderización básica del SVG usando `SvgXml`
- [x] Aceptar `style` prop y envolver `SvgXml` en un `View` para que sea medible (onLayout)
- [x] Propiedades: `svgString`, `bounds`, `locations`, `markers`

**Archivo:** `src/components/SVGMap.tsx`

```typescript
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import type { SVGMapProps } from '@/types';

type SVGMapComponentProps = Pick<SVGMapProps, 'svgString'> & {
  style?: ViewStyle;
};

export const SVGMap: React.FC<SVGMapComponentProps> = ({ svgString, style }) => (
  <View style={style}>
    {/* SvgXml se ajusta al tamaño del View padre */}
    <SvgXml xml={svgString} width="100%" height="100%" />
  </View>
);
```

---

### 1.4 Crear Componente de Ejemplo
- [x] Crear archivo `src/components/SampleSVGMap.tsx`
- [x] Crear un SVG de ejemplo (campus simple)
- [x] Renderizar usando `ResumableZoom` + `SVGMap` (Interaction Layer provee la interactividad)
- [x] Esto será usado en `App.tsx` para demostración

**Archivo de referencia:** `src/components/SampleSVGMap.tsx` (implementación final con `ResumableZoom`)

```typescript
// El sample actual usa ResumableZoom en lugar de solo SVGMap
// para proveer zoom/pan y permitir que el child sea medido correctamente.
```

---

### 1.5 Actualizar App.tsx
- [ ] Importar `SampleSVGMap`
- [ ] Renderizar en lugar de contenido anterior
- [ ] Asegurar que todo compila sin errores

**Referencia:** `App.tsx` es el entry point principal

---

### 1.6 Instalar Dependencias
- [ ] Verificar que `react-native-svg` está en `package.json`
- [ ] Ejecutar `npm install` si es necesario
- [ ] Validar que TypeScript no muestra errores

---

## ✅ Checklist de Validación

Antes de pasar a Fase 2, verifica:

- [ ] Las carpetas `src/` existen con la estructura correcta
- [ ] `src/types/index.ts` define todas las interfaces necesarias
- [ ] `src/components/SVGMap.tsx` renderiza sin errores
- [ ] `src/components/SampleSVGMap.tsx` existe con SVG de ejemplo
- [ ] `App.tsx` renderiza `SampleSVGMap` correctamente
- [ ] Ejecutar `npm start` muestra la app sin errores
- [ ] El SVG de ejemplo se ve en la pantalla (aunque sin interactividad)

---

## 🧪 Pruebas Manuales

1. **Ejecutar la app:**
   ```bash
   npm start
   # Elige tu plataforma (web/ios/android)
   ```

2. **Verificar renderización:**
   - El SVG del campus debe verse en pantalla
   - Se deben ver 4 elementos (Admin, Library, Cafeteria, Plaza)
   - Los colores y textos deben ser visibles

3. **Verificar TypeScript:**
   ```bash
   npx tsc --noEmit
   ```
   No debe haber errores de tipo

---

## 📝 Notas Importantes

- **Path alias:** Usa `@/` para importaciones desde `src/`
- **Estilo:** Usa `StyleSheet.create()` para mejor performance
- **SVG:** Por ahora es estático, sin interactividad
- **Versión Expo:** 56.0.9 (mira AGENTS.md)

---

## 🔗 Próximo Paso

Una vez completada esta fase, ve a `docs/PHASE-02-interaction-layer.md` para agregar zoom y pan.

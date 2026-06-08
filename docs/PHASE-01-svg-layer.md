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
- [ ] Crear archivo `src/components/SVGMap.tsx`
- [ ] Implementar renderización básica del SVG
- [ ] Usar `react-native-svg` para renderizar
- [ ] Propiedades: `svgString`, `bounds`, `locations`, `markers`
- [ ] Sin interactividad aún (solo render)

**Archivo:** `src/components/SVGMap.tsx`

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
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
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
      >
        {/* SVG content will be rendered here */}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
```

---

### 1.4 Crear Componente de Ejemplo
- [ ] Crear archivo `src/components/SampleSVGMap.tsx`
- [ ] Crear un SVG de ejemplo (campus simple)
- [ ] Renderizar usando el componente `SVGMap`
- [ ] Esto será usado en `App.tsx` para demostración

**Archivo:** `src/components/SampleSVGMap.tsx`

```typescript
import React from 'react';
import { SVGMap } from './SVGMap';
import type { Location } from '@/types';

const CAMPUS_SVG = `
<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#f0f0f0"/>
  
  <!-- Edificio de Administración -->
  <rect id="admin" x="50" y="50" width="200" height="150" fill="#e3f2fd" stroke="#1976d2" stroke-width="2"/>
  <text x="150" y="135" text-anchor="middle" font-size="16" fill="#000">Admin</text>
  
  <!-- Biblioteca -->
  <rect id="library" x="350" y="50" width="200" height="150" fill="#f3e5f5" stroke="#7b1fa2" stroke-width="2"/>
  <text x="450" y="135" text-anchor="middle" font-size="16" fill="#000">Library</text>
  
  <!-- Cafetería -->
  <rect id="cafeteria" x="650" y="50" width="100" height="150" fill="#fff3e0" stroke="#f57c00" stroke-width="2"/>
  <text x="700" y="135" text-anchor="middle" font-size="12" fill="#000">Cafe</text>
  
  <!-- Patio Central -->
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

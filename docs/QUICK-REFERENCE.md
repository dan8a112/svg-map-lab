# 📚 Referencia Rápida - SVG Map Lab

## 🎯 Acceso Rápido a Fases

| Fase | Nombre | Estado | Archivo |
|------|--------|--------|---------|
| 1 | SVG Layer | 🔲 Pendiente | `docs/PHASE-01-svg-layer.md` |
| 2 | Interaction Layer | 🔲 Pendiente | `docs/PHASE-02-interaction-layer.md` |
| 3 | Projection Layer | 🔲 Pendiente | `docs/PHASE-03-projection-layer.md` |
| 4 | Marker Layer | 🔲 Pendiente | `docs/PHASE-04-marker-layer.md` |
| 5 | Location Layer | 🔲 Pendiente | `docs/PHASE-05-location-layer.md` |

---

## 🚀 Comandos Útiles

### Iniciar Desarrollo
```bash
npm start          # Inicia dev server
npm run android    # Emulador Android
npm run ios        # Simulador iOS
npm run web        # Preview web
```

### Verificar Código
```bash
npx tsc --noEmit   # Verificar tipos
npm run lint       # (si existe)
npm test           # (si existe)
```

---

## 📂 Estructura de Carpetas Esperada

```
src/
├── components/          # Componentes React
│   ├── CompleteSVGMap.tsx
│   ├── DynamicSVGMap.tsx
│   ├── InteractiveSVGMap.tsx
│   ├── LocationHighlight.tsx
│   ├── LocationLayer.tsx
│   ├── MarkerIcon.tsx
│   ├── MarkerLayer.tsx
│   ├── ProjectedSVGMap.tsx
│   ├── SampleSVGMap.tsx
│   ├── SVGMap.tsx
│   └── index.ts
│
├── hooks/               # Custom hooks
│   ├── useCoordinateProjection.ts
│   ├── useLocationProximity.ts
│   ├── useLocationState.ts
│   ├── useLocationProjection.ts
│   ├── useMapTransform.ts
│   ├── useTapDetection.ts
│   └── useMarkerAnimation.ts
│
├── types/               # Definiciones TypeScript
│   ├── index.ts
│   ├── locations.ts
│   ├── markers.ts
│   └── projection.ts
│
├── utils/               # Utilidades
│   └── CoordinateProjection.ts
│
└── constants/           # Constantes
    └── (a crear según necesidad)
```

---

## 💾 Dependencias Clave

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `react-native-svg` | Latest | Renderizar SVG |
| `react-native-gesture-handler` | Latest | Gestos (pinch, pan) |
| `react-native-reanimated` | Latest | Animaciones performantes |
| `expo` | ~56.0.9 | Framework base |
| `react-native` | 0.85.3 | Framework React Native |

---

## 🔑 Conceptos Clave

### Capas del Proyecto

1. **SVG Layer**: Renderiza el mapa base en SVG
2. **Interaction Layer**: Gestiona zoom (pinch) y pan (drag)
3. **Projection Layer**: Convierte GPS ↔ SVG
4. **Marker Layer**: Renderiza marcadores dinámicos
5. **Location Layer**: Define entidades del mapa e interacción

### Proyección de Coordenadas

```
GPS (Latitud, Longitud)
         ↓
[CoordinateProjection]
         ↓
SVG (X, Y) en pixels
```

### Tipos Principales

- **Bounds**: Límites geográficos en GPS
- **Location**: Entidad del mapa (edificio, café, etc.)
- **Marker**: Punto dinámico (usuario, runner, etc.)
- **DynamicMarker**: Marcador con tipo y animación

---

## 🧪 Checklist de Progreso

### Fase 1: SVG Layer
- [ ] Carpetas `src/` creadas
- [ ] Tipos base definidos
- [ ] `SVGMap.tsx` funcional
- [ ] `SampleSVGMap.tsx` con ejemplo
- [ ] `App.tsx` renderizando correctamente

### Fase 2: Interaction Layer
- [ ] Dependencias instaladas (gesture-handler, reanimated)
- [ ] `useMapTransform` hook creado
- [ ] `InteractiveSVGMap` con pinch y pan
- [ ] `useTapDetection` detectando toques
- [ ] Zoom y pan funcionando

### Fase 3: Projection Layer
- [ ] `projection.ts` tipos definidos
- [ ] `CoordinateProjection` clase implementada
- [ ] `useCoordinateProjection` hook
- [ ] `useLocationProjection` proyectando marcadores
- [ ] Conversiones GPS ↔ SVG validadas

### Fase 4: Marker Layer
- [ ] `markers.ts` tipos y estilos
- [ ] `MarkerIcon` renderiza círculos
- [ ] `useMarkerAnimation` animaciones
- [ ] `MarkerLayer` renderiza todos
- [ ] `DynamicSVGMap` integra todo

### Fase 5: Location Layer
- [ ] `locations.ts` tipos definidos
- [ ] `LocationHighlight` resaltes
- [ ] `useLocationState` estado
- [ ] `LocationLayer` interacción
- [ ] `CompleteSVGMap` sistema completo
- [ ] Info panel funcional

---

## 🎨 Colores y Estilos Estándar

### Marcadores
- **User**: `#4285F4` (Azul)
- **Runner**: `#EA4335` (Rojo)
- **Location**: `#FBBC04` (Amarillo)
- **Custom**: `#34A853` (Verde)

### Highlights
- **Seleccionado**: `#FF6B6B` (Rojo oscuro)
- **Resaltado**: `#FFC107` (Amarillo claro)

---

## 📖 Path Aliases

En lugar de:
```typescript
import { SVGMap } from '../components/SVGMap';
```

Usa:
```typescript
import { SVGMap } from '@/components/SVGMap';
```

**Configurado en:** `tsconfig.json`

---

## ⚙️ Configuración Importante

### Metro Config
- Extensiones soportadas: `ts`, `tsx`
- Expo defaults incluidos
- No modificar resolvers requeridos

### TypeScript
- Strict mode: `ON`
- Base URL: `.` (raíz del proyecto)
- Alias: `@/* → src/*`

### Expo
- Versión: ~56.0.9
- Entry point: `App.tsx`

---

## 🐛 Troubleshooting Común

### "react-native-gesture-handler not found"
```bash
npm install react-native-gesture-handler
```

### "Reanimated shared value error"
Asegurate de envolver con `GestureHandlerRootView`

### "SVG not rendering"
Verifica:
- `react-native-svg` está instalado
- SVG string es válido XML
- viewBox está definido

### "Tipo no encontrado"
```bash
npx tsc --noEmit  # Identificar el error
```

---

## 📚 Referencias Externas

- **React Native SVG**: https://github.com/react-native-svg/react-native-svg
- **Reanimated**: https://docs.swmansion.com/react-native-reanimated/
- **Gesture Handler**: https://docs.swmansion.com/react-native-gesture-handler/
- **Expo**: https://docs.expo.dev/versions/v56.0.0/

---

## 💡 Tips de Performance

1. **Usa `React.memo` para componentes estáticos**
2. **Reanimated Shared Values evitan re-renders**
3. **StyleSheet.create() es más rápido que inline styles**
4. **Virtualiza listas de 100+ items**
5. **Lazy load ubicaciones fuera de viewport**

---

## 🔗 Flujo de Desarrollo Recomendado

1. **Semana 1**: Fase 1 + 2 (SVG + Interacción)
2. **Semana 2**: Fase 3 (Proyección)
3. **Semana 3**: Fase 4 + 5 (Marcadores + Locations)
4. **Semana 4+**: Polish, testing, optimización

---

## 📝 Notas Finales

- **Commit frecuentemente** al completar cada tarea
- **Testa en múltiples plataformas** (iOS, Android, Web)
- **Documenta cambios importantes** en comentarios
- **Revisa TypeScript regularly** para evitar deuda técnica

---

**¿Listo para comenzar?** Abre `docs/PHASE-01-svg-layer.md` 🚀

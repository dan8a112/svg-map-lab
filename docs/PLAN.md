# 🗺️ SVG Map Lab - Plan de Desarrollo Secuencial

## Visión General
Este documento organiza el desarrollo del proyecto SVG Map Lab en fases secuenciales. Cada fase construye sobre la anterior y puede ejecutarse de forma independiente.

**Estructura:** El proyecto se divide en 5 capas funcionales que se implementan de forma progresiva.

---

## 📋 Fases de Desarrollo

### **Fase 1: Configuración Base y SVG Layer**
Establece la estructura del proyecto y renderiza mapas SVG básicos.
- **Duración estimada:** 1-2 días
- **Archivo de detalles:** `docs/PHASE-01-svg-layer.md`

### **Fase 2: Interaction Layer**
Implementa zoom (pinch), pan (drag) y gestos básicos sobre el SVG.
- **Duración estimada:** 2-3 días
- **Archivo de detalles:** `docs/PHASE-02-interaction-layer.md`

### **Fase 3: Projection Layer**
Convierte coordenadas GPS en coordenadas del SVG y viceversa.
- **Duración estimada:** 1-2 días
- **Archivo de detalles:** `docs/PHASE-03-projection-layer.md`

### **Fase 4: Marker Layer**
Renderiza marcadores en tiempo real (usuario actual, runners, ubicaciones dinámicas).
- **Duración estimada:** 1-2 días
- **Archivo de detalles:** `docs/PHASE-04-marker-layer.md`

### **Fase 5: Location Layer**
Define entidades del mapa y permite interacción con elementos SVG específicos.
- **Duración estimada:** 1-2 días
- **Archivo de detalles:** `docs/PHASE-05-location-layer.md`

---

## 🚀 Cómo Usar Este Plan

1. **Comienza con Fase 1** (`docs/PHASE-01-svg-layer.md`)
2. Cada fase contiene:
   - **Objetivos claros**
   - **Checklist de tareas**
   - **Comandos para ejecutar**
   - **Pruebas de validación**
3. Completa todas las tareas de una fase antes de pasar a la siguiente
4. Actualiza el estado de cada fase conforme avances

---

## 📊 Estructura de Capas

```
┌─────────────────────────────┐
│   5. Location Layer         │ ← Entidades del mapa
├─────────────────────────────┤
│   4. Marker Layer           │ ← Marcadores en tiempo real
├─────────────────────────────┤
│   3. Projection Layer       │ ← Conversión de coordenadas
├─────────────────────────────┤
│   2. Interaction Layer      │ ← Zoom, pan, gestos
├─────────────────────────────┤
│   1. SVG Layer (Base)       │ ← Renderización SVG
└─────────────────────────────┘
```

---

## ✅ Estado Global del Proyecto

- [x] Fase 1: SVG Layer
- [x] Fase 2: Interaction Layer
- [ ] Fase 3: Projection Layer
- [ ] Fase 4: Marker Layer
- [ ] Fase 5: Location Layer

**Próximo paso:** Abre `docs/PHASE-01-svg-layer.md` para comenzar.

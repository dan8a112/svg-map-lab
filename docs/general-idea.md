# SVG Map Lab (React Native)

## 📌 Visión del proyecto

SVG Map Lab es un laboratorio experimental para construir un sistema de mapas interactivos en React Native basado en SVG.

El objetivo es crear una base tecnológica reutilizable que permita:

- Renderizar mapas SVG personalizados (campus, edificios, centros comerciales, etc.)
- Interactuar con elementos del SVG como si fueran entidades geográficas
- Aplicar zoom y pan tipo Google Maps
- Proyectar coordenadas GPS reales sobre mapas no geográficos
- Permitir tracking en tiempo real de usuarios sobre mapas personalizados

Este proyecto eventualmente evolucionará hacia una librería desacoplada para React Native.

---

## 🎯 Problema que resuelve

Las soluciones tradicionales de mapas (Google Maps, Mapbox) no son adecuadas para:

- Espacios cerrados (universidades, hospitales, edificios)
- Mapas personalizados sin geografía real
- Sistemas donde las ubicaciones son semánticas (biblioteca, cafetería, etc.)
- Tracking dentro de espacios privados o controlados

SVG Map Lab resuelve esto permitiendo un sistema de coordenadas híbrido:

---

## 🧠 Concepto central

El mapa no es geográfico.

Es un sistema de coordenadas proyectadas sobre un SVG.

Cada elemento del SVG puede convertirse en:

- Zona interactiva
- Ubicación lógica
- Punto de interés
- Punto de navegación

---

## 🧩 Arquitectura conceptual

El sistema se divide en capas:

### 1. SVG Layer
Renderiza el mapa base.

- SVG arbitrario
- Campus / edificio / plano
- Totalmente personalizable

---

### 2. Interaction Layer

Permite:

- Zoom (pinch)
- Pan (drag)
- Tap en elementos SVG
- Detección de zonas

---

### 3. Projection Layer

Convierte coordenadas:
Usando bounds definidos por el usuario.

---

### 4. Marker Layer

Renderiza:

- Usuario actual
- Runners en tiempo real
- Ubicaciones dinámicas

---

### 5. Location Layer

Define entidades del mapa:

```ts
Location {
  id: string
  name: string
  svgElementId: string
}
```

### 5. Example

Ejemplo de uso:
```js
<SvgMap
  svg={campusSvg}
  bounds={{
    north: 15.5023,
    south: 15.4998,
    east: -88.0201,
    west: -88.0245
  }}
  locations={[
    { id: "biblioteca", elementId: "biblioteca" },
    { id: "cafeteria", elementId: "cafeteria" }
  ]}
  markers={[
    { lat: 15.5012, lon: -88.0221 }
  ]}
/>
```

## Interactividad del SVG

Cualquier elemento SVG puede ser interactivo:

```svg
<rect>
<circle>
<path>
<polygon>
<ellipse>
```

Ejemplo:

```svg
<rect id="biblioteca" x="100" y="100" width="200" height="100" />
```
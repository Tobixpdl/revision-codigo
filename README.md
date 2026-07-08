# Revisión de Código

Mini web estática para practicar revisión de código para parciales universitarios.

Funciona sin backend, sin base de datos y sin API keys. Los ejercicios se importan desde archivos JSON y se guardan en `localStorage`, junto con packs, progreso y estadísticas.

## Stack

- React
- Vite
- JavaScript
- CSS normal
- localStorage
- GitHub Pages mediante `gh-pages`

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Luego abrí la URL que indique Vite, normalmente:

```bash
http://localhost:5173
```

## Compilar para producción

```bash
npm run build
```

## Previsualizar build

```bash
npm run preview
```

## Deploy a GitHub Pages

El proyecto ya incluye el script:

```bash
npm run deploy
```

Antes de desplegar, verificá que el repositorio ya exista en GitHub y que el proyecto tenga el `remote` configurado.

La configuración de Vite usa:

```js
base: './'
```

Esto permite que la app funcione bien en GitHub Pages sin depender de una ruta absoluta específica.

## Formato principal de importación

La app acepta un objeto con metadata y un array `exercises`:

```json
{
  "schemaVersion": 1,
  "packName": "Programación - Parcial 1",
  "language": "C++",
  "description": "Ejercicios de revisión de código sobre funciones, arrays, ciclos y búsqueda.",
  "exercises": [
    {
      "id": "ej-001",
      "materia": "Programación",
      "tema": "Funciones",
      "dificultad": "fácil",
      "consigna": "Revisá el código y marcá la línea donde está el error. Si está bien, elegí la opción 'El código está bien'.",
      "codigo": [
        "int suma(int a, int b) {",
        "    return a - b;",
        "}"
      ],
      "tieneError": true,
      "lineaError": 2,
      "tipoError": "operador incorrecto",
      "explicacion": "La función se llama suma y debería devolver la suma de a y b, pero en la línea 2 se está usando el operador de resta.",
      "correccionSugerida": "return a + b;"
    }
  ]
}
```

## Formato alternativo aceptado

También se puede importar directamente un array:

```json
[
  {
    "id": "ej-001",
    "materia": "Programación",
    "tema": "Funciones",
    "dificultad": "fácil",
    "consigna": "Revisá el código y marcá la línea donde está el error.",
    "codigo": [
      "int suma(int a, int b) {",
      "    return a - b;",
      "}"
    ],
    "tieneError": true,
    "lineaError": 2,
    "tipoError": "operador incorrecto",
    "explicacion": "La función debería sumar, pero en la línea 2 está restando.",
    "correccionSugerida": "return a + b;"
  }
]
```

## Validaciones

Campos obligatorios por ejercicio:

- `id`
- `materia`
- `tema`
- `dificultad`
- `consigna`
- `codigo`
- `tieneError`
- `lineaError`
- `explicacion`

Reglas:

- `id` debe ser string.
- `materia` debe ser string.
- `tema` debe ser string.
- `dificultad` debe ser `fácil`, `media` o `difícil`.
- `consigna` debe ser string.
- `codigo` debe ser un array de strings.
- `tieneError` debe ser boolean.
- Si `tieneError` es `true`, `lineaError` debe ser un número entero entre 1 y la cantidad de líneas del código.
- Si `tieneError` es `false`, `lineaError` debe ser `null`.
- `tipoError` puede ser string o null.
- `explicacion` debe ser string.
- `correccionSugerida` puede ser string o null.

## Funcionalidades

- Importación por archivo `.json`.
- Importación pegando JSON manualmente.
- Validación antes de confirmar.
- Resumen del pack importado.
- Renombrado automático de IDs duplicados.
- Guardado persistente en `localStorage`.
- Administración de packs.
- Eliminación de pack individual.
- Eliminación de todos los ejercicios.
- Backup JSON de ejercicios, packs y estadísticas.
- Reset total.
- Filtros por pack, materia, tema y dificultad.
- Modo secuencial.
- Modo aleatorio.
- Código con líneas numeradas y clickeables.
- Opción “El código está bien”.
- Corrección con explicación y corrección sugerida.
- Estadísticas globales y por sesión.
- Historial simple de respuestas.
- Diseño responsive.

## Estructura

```txt
revision-codigo/
├─ package.json
├─ index.html
├─ vite.config.js
├─ README.md
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ styles.css
│  ├─ components/
│  │  ├─ CodeViewer.jsx
│  │  ├─ ExerciseCard.jsx
│  │  ├─ Filters.jsx
│  │  ├─ ImportExercises.jsx
│  │  ├─ ManageExercises.jsx
│  │  ├─ ResultBox.jsx
│  │  └─ StatsPanel.jsx
│  └─ utils/
│     ├─ exerciseValidation.js
│     ├─ exerciseHelpers.js
│     └─ storage.js
```

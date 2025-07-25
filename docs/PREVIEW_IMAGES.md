# Sistema de Imágenes de Preview

Este sistema genera automáticamente imágenes de preview optimizadas para cada post del blog durante el proceso de build.

## Características

- **Generación automática**: Las imágenes se crean durante el build del proyecto
- **Optimización**: Imágenes en formato WebP con alta calidad y tamaño reducido
- **Diseño personalizado**: Cada imagen incluye el título del post con un diseño atractivo
- **Responsive**: Imágenes optimizadas para redes sociales (1200x630px)

## Cómo funciona

### 1. Generación de imágenes

El sistema utiliza dos scripts principales:

- `scripts/generateDefaultPreview.mjs`: Genera la imagen por defecto del sitio
- `scripts/generatePreviewImages.mjs`: Genera imágenes para todos los posts del blog

### 2. Proceso de build

Durante el build (`npm run build`), el sistema:

1. Ejecuta `npm run generate:previews`
2. Lee todos los archivos `.md` y `.mdx` del directorio `src/content/blog/`
3. Extrae el título de cada post del frontmatter
4. Genera una imagen de preview personalizada para cada post
5. Guarda las imágenes en `public/previews/`

### 3. Uso en las páginas

El componente `Head.astro` detecta automáticamente si existe una imagen de preview específica para el post:

- Si se proporciona una imagen específica en el frontmatter, la usa
- Si no, busca una imagen generada en `/previews/{slug}.webp`
- Como fallback, usa la imagen por defecto `/preview.webp`

## Estructura de archivos

```
public/
├── preview.webp                    # Imagen por defecto del sitio
└── previews/
    ├── post-slug-1.webp           # Imagen para post 1
    ├── post-slug-2.webp           # Imagen para post 2
    └── ...
```

## Personalización

### Modificar el diseño

Para cambiar el diseño de las imágenes, edita el archivo `src/lib/generatePreviewImage.js`:

- **Colores**: Modifica los gradientes en el SVG
- **Tipografía**: Cambia `fontFamily`, `fontSize`, etc.
- **Elementos visuales**: Ajusta círculos, líneas y patrones decorativos

### Ajustar el tamaño del texto

El sistema ajusta automáticamente el tamaño del texto según la longitud del título:

- Títulos largos (>60 caracteres): 36px
- Títulos medianos (>40 caracteres): 42px
- Títulos cortos: 48px

## Comandos disponibles

```bash
# Generar solo las imágenes de preview
npm run generate:previews

# Build completo (incluye generación de imágenes)
npm run build

# Generar imagen por defecto
node scripts/generateDefaultPreview.mjs

# Generar imágenes para todos los posts
node scripts/generatePreviewImages.mjs
```

## Tecnologías utilizadas

- **Sharp**: Para optimización de imágenes
- **@resvg/resvg-js**: Para renderizado de SVG a PNG
- **SVG**: Para el diseño vectorial de las imágenes
- **WebP**: Formato de salida optimizado

## Metadatos generados

Cada imagen incluye los siguientes metadatos de Open Graph y Twitter:

- `og:image`: URL de la imagen de preview
- `twitter:image`: URL de la imagen de preview
- `og:title`: Título del post
- `og:description`: Descripción del post

## Optimización

Las imágenes se optimizan con las siguientes características:

- **Formato**: WebP con calidad 90%
- **Tamaño**: 1200x630px (formato estándar para redes sociales)
- **Compresión**: Optimizada para web sin pérdida de calidad visual 
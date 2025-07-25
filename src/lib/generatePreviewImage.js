import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs/promises";
import path from "path";

export async function generatePreviewImage(options) {
  const {
    title,
    width = 1200,
    height = 630,
    textColor = "#ffffff",
    fontSize = 48,
    fontFamily = "Inter, system-ui, sans-serif"
  } = options;

  // Función para ajustar el tamaño del texto según la longitud
  const getFontSize = (text) => {
    if (text.length > 60) return 36;
    if (text.length > 40) return 42;
    return fontSize;
  };

  const adjustedFontSize = getFontSize(title);

  // Crear SVG con el diseño mejorado de la imagen de preview
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Gradiente principal -->
        <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
        
        <!-- Gradiente secundario para elementos decorativos -->
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#f093fb;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#f5576c;stop-opacity:0.8" />
        </linearGradient>
        
        <!-- Patrón de puntos -->
        <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/>
        </pattern>
        
        <!-- Filtro de sombra -->
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      
      <!-- Fondo con gradiente principal -->
      <rect width="100%" height="100%" fill="url(#mainGrad)"/>
      
      <!-- Patrón de puntos decorativo -->
      <rect width="100%" height="100%" fill="url(#dots)"/>
      
      <!-- Elementos decorativos de fondo -->
      <circle cx="100" cy="100" r="80" fill="url(#accentGrad)" opacity="0.1"/>
      <circle cx="${width - 150}" cy="${height - 150}" r="120" fill="url(#accentGrad)" opacity="0.08"/>
      <circle cx="${width - 300}" cy="200" r="60" fill="url(#accentGrad)" opacity="0.12"/>
      
      <!-- Contenedor principal del contenido -->
      <rect x="80" y="80" width="${width - 160}" height="${height - 160}" 
            fill="rgba(255,255,255,0.08)" rx="24" 
            stroke="rgba(255,255,255,0.15)" stroke-width="2"
            filter="url(#shadow)"/>
      
      <!-- Línea decorativa superior -->
      <rect x="120" y="120" width="80" height="4" fill="url(#accentGrad)" rx="2"/>
      
      <!-- Título del blog -->
      <text x="${width / 2}" y="${height / 2 - 20}" 
            font-family="${fontFamily}" 
            font-size="${adjustedFontSize}" 
            font-weight="700" 
            fill="${textColor}" 
            text-anchor="middle" 
            dominant-baseline="middle"
            filter="url(#shadow)"
            style="letter-spacing: -0.02em;">
        ${title}
      </text>
      
      <!-- Subtítulo -->
      <text x="${width / 2}" y="${height / 2 + 60}" 
            font-family="${fontFamily}" 
            font-size="20" 
            font-weight="500" 
            fill="rgba(255,255,255,0.9)" 
            text-anchor="middle" 
            dominant-baseline="middle"
            style="letter-spacing: 0.1em; text-transform: uppercase;">
        Blog Personal
      </text>
      
      <!-- Elementos decorativos adicionales -->
      <circle cx="200" cy="180" r="4" fill="rgba(255,255,255,0.4)"/>
      <circle cx="${width - 200}" cy="${height - 180}" r="6" fill="rgba(255,255,255,0.3)"/>
      <circle cx="${width - 250}" cy="250" r="3" fill="rgba(255,255,255,0.5)"/>
      
      <!-- Línea decorativa inferior -->
      <rect x="${width - 200}" y="${height - 140}" width="60" height="3" fill="url(#accentGrad)" rx="1.5"/>
    </svg>
  `;

  // Convertir SVG a PNG usando resvg
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  // Optimizar la imagen con sharp
  const optimizedBuffer = await sharp(pngBuffer)
    .webp({ quality: 90 })
    .toBuffer();

  return optimizedBuffer;
}

export async function generatePreviewImageForPost(title, outputPath) {
  try {
    const buffer = await generatePreviewImage({ title });
    
    // Asegurar que el directorio existe
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
    
    // Guardar la imagen
    await fs.writeFile(outputPath, buffer);
    
    console.log(`✅ Preview image generated: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error generating preview image for "${title}":`, error);
  }
}
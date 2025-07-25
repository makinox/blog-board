import sharp from "sharp";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs/promises";
import path from "path";

export async function generatePreviewImage(options) {
  const {
    title,
    width = 1200,
    height = 630,
    textColor = "#1c1917", // stone-900
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

  // Crear SVG con el diseño minimalista que coincide con el sitio
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Filtro de sombra sutil -->
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.1)"/>
        </filter>
        
        <!-- Patrón de líneas sutiles -->
        <pattern id="lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <line x1="0" y1="40" x2="40" y2="0" stroke="rgba(28,25,23,0.03)" stroke-width="1"/>
        </pattern>
      </defs>
      
      <!-- Fondo principal - stone-100 -->
      <rect width="100%" height="100%" fill="#f5f5f4"/>
      
      <!-- Patrón de líneas sutiles -->
      <rect width="100%" height="100%" fill="url(#lines)"/>
      
      <!-- Elementos decorativos sutiles -->
      <circle cx="100" cy="100" r="60" fill="rgba(28,25,23,0.02)"/>
      <circle cx="${width - 120}" cy="${height - 120}" r="80" fill="rgba(28,25,23,0.015)"/>
      <circle cx="${width - 200}" cy="150" r="40" fill="rgba(28,25,23,0.025)"/>
      
      <!-- Contenedor principal del contenido -->
      <rect x="60" y="60" width="${width - 120}" height="${height - 120}" 
            fill="rgba(255,255,255,0.7)" rx="16" 
            stroke="rgba(28,25,23,0.1)" stroke-width="1"
            filter="url(#shadow)"/>
      
      <!-- Línea decorativa superior -->
      <rect x="100" y="100" width="60" height="2" fill="rgba(28,25,23,0.3)" rx="1"/>
      
      <!-- Logo/Branding -->
      <text x="100" y="140" 
            font-family="${fontFamily}" 
            font-size="24" 
            font-weight="600" 
            fill="rgba(28,25,23,0.7)" 
            style="letter-spacing: -0.02em;">
        Voib
      </text>
      
      <!-- Título del blog -->
      <text x="${width / 2}" y="${height / 2 - 30}" 
            font-family="${fontFamily}" 
            font-size="${adjustedFontSize}" 
            font-weight="600" 
            fill="${textColor}" 
            text-anchor="middle" 
            dominant-baseline="middle"
            style="letter-spacing: -0.02em; line-height: 1.2;">
        ${title}
      </text>
      
      <!-- Subtítulo -->
      <text x="${width / 2}" y="${height / 2 + 50}" 
            font-family="${fontFamily}" 
            font-size="18" 
            font-weight="400" 
            fill="rgba(28,25,23,0.6)" 
            text-anchor="middle" 
            dominant-baseline="middle"
            style="letter-spacing: 0.05em;">
        Un blog de Jesús Bossa
      </text>
      
      <!-- Elementos decorativos sutiles -->
      <circle cx="200" cy="180" r="2" fill="rgba(28,25,23,0.2)"/>
      <circle cx="${width - 180}" cy="${height - 180}" r="3" fill="rgba(28,25,23,0.15)"/>
      <circle cx="${width - 220}" cy="220" r="1.5" fill="rgba(28,25,23,0.25)"/>
      
      <!-- Línea decorativa inferior -->
      <rect x="${width - 160}" y="${height - 120}" width="40" height="1.5" fill="rgba(28,25,23,0.2)" rx="0.75"/>
      
      <!-- Flecha decorativa -->
      <g transform="translate(${width - 80}, ${height - 80})">
        <line x1="0" y1="0" x2="20" y2="0" stroke="rgba(28,25,23,0.3)" stroke-width="2" stroke-linecap="round"/>
        <polyline points="12,0 20,0 16,4" fill="none" stroke="rgba(28,25,23,0.3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
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
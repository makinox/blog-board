import { generatePreviewImageForPost } from "../src/lib/generatePreviewImage.js";
import path from "path";

async function generateDefaultPreview() {
  console.log("🚀 Generating default preview image...");
  
  try {
    const outputPath = path.join(
      process.cwd(), 
      "public", 
      "preview.webp"
    );
    
    await generatePreviewImageForPost("Blog Personal", outputPath);
    
    console.log("✅ Default preview image generated successfully!");
    
  } catch (error) {
    console.error("❌ Error generating default preview image:", error);
    process.exit(1);
  }
}

generateDefaultPreview(); 
import { generatePreviewImageForPost } from "../src/lib/generatePreviewImage.js";
import path from "path";
import fs from "fs/promises";

async function generateAllPreviewImages() {
  console.log("🚀 Starting preview image generation...");
  
  try {
    const contentDir = path.join(process.cwd(), "src", "content", "blog");
    const files = await fs.readdir(contentDir);
    const postFiles = files.filter(file => file.endsWith(".md") || file.endsWith(".mdx"));
    
    console.log(`📝 Found ${postFiles.length} posts to process`);
    
    const promises = postFiles.map(async (file) => {
      const slug = file.replace(/\.(md|mdx)$/, "");
      const filePath = path.join(contentDir, file);
      const content = await fs.readFile(filePath, "utf-8");

      const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
      const title = titleMatch ? titleMatch[1] : slug;
      
      const outputPath = path.join(
        process.cwd(), 
        "public", 
        "previews", 
        `${slug}.webp`
      );
      
      await generatePreviewImageForPost(title, outputPath);
    });
    
    await Promise.all(promises);
    
    console.log("✅ All preview images generated successfully!");
    
  } catch (error) {
    console.error("❌ Error generating preview images:", error);
    process.exit(1);
  }
}

generateAllPreviewImages(); 
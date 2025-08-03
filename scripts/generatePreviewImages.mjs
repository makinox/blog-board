import { generatePreviewImageForPost } from "./generatePreviewImage.js";
import path from "path";
import fs from "fs/promises";

async function generateAllPreviewImages() {
  const force = process.argv.includes("--force");
  
  if (force) {
    console.log("🚀 Starting FORCED preview image generation (all images will be regenerated)...");
  } else {
    console.log("🚀 Starting optimized preview image generation...");
  }
  
  try {
    const contentDir = path.join(process.cwd(), "src", "content", "blog");
    const previewsDir = path.join(process.cwd(), "public", "previews");
    
    await fs.mkdir(previewsDir, { recursive: true });
    
    const files = await fs.readdir(contentDir);
    const postFiles = files.filter(file => file.endsWith(".md") || file.endsWith(".mdx"));
    
    console.log(`📝 Found ${postFiles.length} posts to process`);
    
    let existingPreviewNames = new Set();
    if (!force) {
      const existingPreviews = await fs.readdir(previewsDir);
      existingPreviewNames = new Set(existingPreviews.map(file => file.replace(".webp", "")));
      console.log(`🖼️  Found ${existingPreviewNames.size} existing preview images`);
    }
    
    let generatedCount = 0;
    let skippedCount = 0;
    
    const promises = postFiles.map(async (file) => {
      const slug = file.replace(/\.(md|mdx)$/, "").toLowerCase();
      const filePath = path.join(contentDir, file);
      const content = await fs.readFile(filePath, "utf-8");

      const titleMatch = content.match(/title:\s*["']([^"']+)["']/);
      const title = (titleMatch ? titleMatch[1] : slug).toLowerCase();
      
      const outputPath = path.join(previewsDir, `${slug}.webp`);
      
      if (!force && existingPreviewNames.has(slug)) {
        console.log(`⏭️  Skipping existing preview: ${slug}.webp`);
        skippedCount++;
        return;
      }
      
      console.log(`🔄 Generating preview for: ${slug}`);
      await generatePreviewImageForPost(title, outputPath);
      generatedCount++;
    });
    
    await Promise.all(promises);
    
    if (force) {
      console.log(`✅ All preview images regenerated successfully!`);
      console.log(`📊 Total images generated: ${generatedCount}`);
    } else {
      console.log(`✅ Preview generation completed!`);
      console.log(`📊 Generated: ${generatedCount} new images`);
      console.log(`⏭️  Skipped: ${skippedCount} existing images`);
      
      if (generatedCount === 0) {
        console.log(`🎉 All preview images are up to date!`);
      }
    }
    
  } catch (error) {
    console.error("❌ Error generating preview images:", error);
    process.exit(1);
  }
}

generateAllPreviewImages(); 
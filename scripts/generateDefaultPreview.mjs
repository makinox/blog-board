import { generatePreviewImageForPost } from "./generatePreviewImage.js";
import path from "path";
import fs from "fs/promises";

async function generateDefaultPreview() {
  const force = process.argv.includes("--force");

  if (force) {
    console.log("🚀 Generating default preview image (forced)...");
  } else {
    console.log("🚀 Checking default preview image...");
  }

  try {
    const outputPath = path.join(process.cwd(), "public", "preview.webp");

    if (!force) {
      try {
        await fs.access(outputPath);
        console.log(
          "⏭️  Default preview image already exists, skipping generation",
        );
        return;
      } catch (error) {
        console.error("Handling the error:", error);
        console.log("🔄 Generating default preview image...");
      }
    }

    await generatePreviewImageForPost("Blog Personal", outputPath);

    console.log("✅ Default preview image generated successfully!");
  } catch (error) {
    console.error("❌ Error generating default preview image:", error);
    process.exit(1);
  }
}

generateDefaultPreview();

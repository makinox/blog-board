import fetch from "node-fetch";
import fs from "fs-extra";
import path from "path";

const GITHUB_API_URL = "https://api.github.com/repos/makinox/storageGarage/contents/archive";
const LOCAL_DIR = "./src/content/blog";

async function downloadFiles() {
  try {
    const response = await fetch(GITHUB_API_URL);
    const files = await response.json();

    await fs.ensureDir(LOCAL_DIR);

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const contentRes = await fetch(file.download_url);
        const content = await contentRes.text();
        await fs.writeFile(path.join(LOCAL_DIR, file.name), content);
      }
    }

    console.log("Archivos MDX remotos descargados con éxito.");
  } catch (err) {
    console.error("Error descargando archivos MDX:", err);
  }
}

downloadFiles();

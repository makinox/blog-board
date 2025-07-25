import { defineConfig, envField } from "astro/config";

import tailwind from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://voib.jesusbossa.dev",
  integrations: [mdx(), sitemap(), react()],
  vite: {
    plugins: [tailwind()]
  },
  schema: {
    PUBLIC_API_ORIGIN: envField.string({ context: "client", access: "public", optional: true })
  }
});
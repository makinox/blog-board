import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"]
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@lib": resolve(__dirname, "./src/lib"),
      "@stores": resolve(__dirname, "./src/stores"),
      "@controllers": resolve(__dirname, "./src/controllers"),
      "@styles": resolve(__dirname, "./src/styles"),
    },
  },
}); 
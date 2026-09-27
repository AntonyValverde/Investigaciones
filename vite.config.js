import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: funciona en la raíz de un dominio o en una subruta (p. ej. GitHub Pages)
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base:"/static/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  clearScreen: false,
  server: {
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  envPrefix: ["VITE_"],
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
  },
  define: {
    "process.env": {},
  },
});

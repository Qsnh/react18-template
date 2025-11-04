import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import gzipPlugin from "rollup-plugin-gzip";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [gzipPlugin()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern",
      },
    },
  },
});

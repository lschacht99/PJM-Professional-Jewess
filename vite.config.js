import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During `npm run dev`, proxy /api to a locally-running Worker
// (`npm run worker:dev`, default port 8787) so you get the full stack locally.
export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
});

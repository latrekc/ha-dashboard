import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/battery-dashboard-card.ts",
      formats: ["es"],
      fileName: () => "battery-dashboard-card.js",
    },
    rollupOptions: {
      output: {
        entryFileNames: "battery-dashboard-card.js",
      },
    },
  },
});
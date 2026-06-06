import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      cssFileName: "styles",
      entry: "src/index.ts",
      fileName: "index",
      formats: ["es"],
      name: "FrancoBookingUi",
    },
    rollupOptions: {
      external: ["react", "react-dom", "framer-motion", "lucide-react"],
    },
  },
});

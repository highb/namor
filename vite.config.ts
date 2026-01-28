import { defineConfig } from "vite";

export default defineConfig({
  base: "/namor/",
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});

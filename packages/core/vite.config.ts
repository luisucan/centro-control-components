import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "index"
    },
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      external: ["lit"],
      output: {
        globals: {
          lit: "lit"
        }
      }
    }
  },
  plugins: [
    dts({
      entryRoot: "src",
      tsconfigPath: "./tsconfig.json"
    })
  ]
});

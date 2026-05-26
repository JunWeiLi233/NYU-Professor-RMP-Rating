import { copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const outputNames = {
  entryFileNames: "[name].js",
  chunkFileNames: "chunks/[name]-[hash].js",
  assetFileNames: "assets/[name]-[hash][extname]",
};

await rm(dist, { recursive: true, force: true });

await build({
  root,
  configFile: false,
  build: {
    outDir: dist,
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: resolve(root, "src/background.js"),
        popup: resolve(root, "src/popup.html"),
      },
      output: outputNames,
    },
  },
});

await mkdir(dist, { recursive: true });
await copyFile(resolve(root, "src/manifest.json"), resolve(dist, "manifest.json"));
await copyFile(resolve(dist, "src/popup.html"), resolve(dist, "popup.html"));

await build({
  root,
  configFile: false,
  build: {
    outDir: dist,
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(root, "src/content.js"),
      output: {
        ...outputNames,
        entryFileNames: "content.js",
        format: "iife",
        inlineDynamicImports: true,
        name: "NyuAlbertRmpContentScript",
      },
    },
  },
});

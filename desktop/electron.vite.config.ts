import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
// @ts-ignore
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@/lib": resolve("src/main/lib"),
        "@shared": resolve("src/shared")
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared"),
        "@/hooks": resolve("src/renderer/src/hooks"),
        "@/assets": resolve("src/renderer/src/assets"),
        "@/store": resolve("src/renderer/src/store"),
        "@/components": resolve("src/renderer/src/components"),
        "@/mocks": resolve("src/renderer/src/mocks"),
        "@/lib": resolve("src/renderer/src/lib"),
        "@/types": resolve("src/renderer/src/@types")
      }
    },
    plugins: [react(), tailwindcss()]
  }
});

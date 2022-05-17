import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { babel } from "@rollup/plugin-babel";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    mode === "production"
      ? ""
      : babel({
          extensions: [".js", ".jsx", ".es6", ".es", ".mjs", "ts", "tsx"],
          babelHelpers: "bundled",
        }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    vue(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}));

import { defineConfig } from "vite";
import path from "path";
import Vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { babel } from "@rollup/plugin-babel";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    mode === "production"
      ? ""
      : babel({
          extensions: [".js", ".jsx", ".es6", ".es", ".mjs", "ts", "tsx"],
          babelHelpers: "bundled",
        }),
    AutoImport({
      dts: "src/types/auto-import.d.ts",
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: false, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
        filepath: "./.eslintrc-auto-import.json", // 生成json文件
        globalsPropValue: true,
      },
    }),
    Components({
      dts: "src/types/components.d.ts",
      resolvers: [ElementPlusResolver(), IconsResolver()],
    }),
    Vue(),
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}));

import { existsSync, readdirSync, statSync, } from "node:fs"
import { parse, resolve, } from "node:path"
import * as process from "node:process"
import I18nTransformer from "@higgins-mmt/vite-plugin-i18n-transformer"
import VuePlugin from "@vitejs/plugin-vue"
import VueJsxPlugin from "@vitejs/plugin-vue-jsx"
import UnoCSS from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver, } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineConfig, loadEnv, } from "vite"

function addPathsToIncludeList(list: string[], directoryPath: string, file: string,) {
  list.push(directoryPath,)
  list.push(`element-plus/es/components/${file}/style/css`,)
}

function readElementPlusComponents(): string[] {
  const viteDevIncludeList: string[] = [
    "element-plus/es",
  ]
  const elementPlusDir = resolve("node_modules", "element-plus", "es", "components",)

  try {
    if (!existsSync(elementPlusDir,)) {
      console.warn(`Directory ${elementPlusDir} does not exist.`,)
      return viteDevIncludeList
    }

    const files = readdirSync(elementPlusDir,)

    if (files.length === 0) {
      console.warn(`Directory ${elementPlusDir} is empty.`,)
      return viteDevIncludeList
    }

    files.forEach((file,) => {
      const filePath = resolve(elementPlusDir, file,)
      const stats = statSync(filePath,)

      if (stats.isDirectory()) {
        const directoryPath = `element-plus/es/components/${file}/style/index`
        const dtsPath = resolve("node_modules", `${directoryPath}.d.ts`,)

        if (existsSync(dtsPath,)) {
          addPathsToIncludeList(viteDevIncludeList, directoryPath, file,)
        }
      }
    },)

    return viteDevIncludeList
  } catch (err) {
    console.error("Error reading Element Plus components:", err,)
    throw err
  }
}

export default defineConfig(({ mode, },) => {
  const env = loadEnv(mode, process.cwd(), "",)
  const now = new Date().getTime()
  return {
    define: {
      __APP_VERSION__: now,
    },
    resolve: {
      alias: {
        "@": resolve("src",),
      },
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
      proxy: {
        "/mmfc": {
          target: env.VITE_OMS_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/mmfc/, "",),
        },
      },
    },
    plugins: [
      VuePlugin(),
      VueJsxPlugin(),
      UnoCSS(),
      I18nTransformer({
        include: ["**.js", "**.jsx", "**.ts", "**.tsx", "**.vue",],
        exclude: ["node_modules/**", "src/hooks/useLocale.ts",],
        i18nCallee: "useI18n().t",
        dependency: {
          name: "useI18n",
          path: "@/hooks/useI18n",
          objectPattern: true,
        },
        output: {
          filename: "zh-CN.json",
          langList: ["en-US.json",],
          path: resolve("public/assets/locales",),
        },
        upload: {
          app: env.VITE_I18N_APP,
          uploadUrl: env.VITE_I18N_URL + env.VITE_I18N_UPLOAD_URL,
        },
      },),
      Components({
        dirs: resolve("src/components",),
        resolvers: [
          ElementPlusResolver({
            exclude: /(ElText|ElTag)/,
            importStyle: "sass",
          },),
        ],
        dts: resolve("src/types/components.d.ts",),
      },),
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass",
          },),
        ],
        imports: ["vue", "vue-router", "@vueuse/head", "@vueuse/core",],
        dirs: ["src/hooks", "src/constants",],
        dts: "src/types/auto-import.d.ts",
        eslintrc: {
          enabled: false,
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
      },),
    ],
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 5 * 1024,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: (assetInfo,) => {
            const name = assetInfo.names[0]
            const { ext, } = parse(name,)
            const img = [
              "svgz",
              "pjp",
              "png",
              "ico",
              "avif",
              "tiff",
              "tif",
              "jfif",
              "svg",
              "xbm",
              "pjpeg",
              "webp",
              "jpg",
              "jpeg",
              "bmp",
              "gif",
            ]
            const font = [".woff", ".woff2", ".ttf",]
            if (img.includes(ext,)) {
              return `assets/images/[name]-[hash].[ext]`
            }
            if (font.includes(ext,)) {
              return `assets/fonts/[name]-[hash].[ext]`
            }
            return "assets/[ext]/[name]-[hash].[ext]"
          },
          manualChunks(id,) {
            const projectRoot = resolve(".",).replace(/\\/g, "/",)
            if (id.includes("node_modules",)) {
              // 其他所有第三方依赖打包到 vendor
              return "vendor"
            }
            if (id.startsWith(projectRoot,) && !id.includes("node_modules",)) {
              if (id.includes("/src/components/",)
                || id.includes("/src/layout/",)
                || id.includes("/src/store/",)
                || id.includes("/src/constants/",)) {
                return "common"
              }
            }
            return null
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "vue-i18n",
        "axios",
        "nprogress",
        "vxe-table",
        "vxe-pc-ui",
        ...readElementPlusComponents(),
      ],
    },
  }
},)

import * as process from "node:process"
import transformerVariantGroup from "@unocss/transformer-variant-group"
import { defineConfig, presetIcons, presetUno } from "unocss"
import { loadEnv } from "vite"
import { ICON_PREFIX } from "./src/constants"

const root = process.cwd()

function createPresetIcons() {
  const isBuild = !!process.argv[4]
  let env: Record<string, string>
  if (!isBuild) {
    env = loadEnv(process.argv[3], root)
  } else {
    env = loadEnv(process.argv[4], root)
  }

  if (env.VITE_USE_ONLINE_ICON === "true") {
    return []
  } else {
    return [
      presetIcons({
        autoInstall: false,
        prefix: ICON_PREFIX,
      }),
    ]
  }
}

export default defineConfig({
  // ...UnoCSS options
  presets: [presetUno({ dark: "class", attributify: false }), ...createPresetIcons()],
  transformers: [transformerVariantGroup()],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/],
    },
  },
})

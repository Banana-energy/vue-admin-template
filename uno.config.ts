import type { Rule, } from "unocss"
import { defineConfig, presetIcons, presetUno, } from "unocss"
import { ICON_PREFIX, } from "./src/constants"

const propertyMap = {
  text: "color",
  bg: "background-color",
  border: "border-color",
  outline: "outline-color",
}

interface Theme {
  colors: Record<string, string>
}

function generateColorRules() {
  return Object.keys(propertyMap,).map(property => [
    new RegExp(`^${property}-(.*)$`,),
    ([, color,], { theme, }: { theme: Theme },) => {
      color = theme.colors[color]
      if (color) {
        const cssProperty = propertyMap[property]
        return { [cssProperty]: color, }
      }
    },
  ],) as Rule<object>[]
}

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno({ dark: "class", attributify: false, },),
    presetIcons({
      autoInstall: false,
      prefix: ICON_PREFIX,
    },),
  ],
  theme: {
    colors: {
      primary: "var(--primary-color)",
      success: "var(--success-color)",
      warning: "var(--warning-color)",
      danger: "var(--danger-color)",
    },
  },
  rules: [
    ...generateColorRules(),
    ["text-main", { color: "var(--primary-text-color)", },],
    ["text-regular", { color: "var(--regular-text-color)", },],
    ["text-secondary", { color: "var(--secondary-text-color)", },],
    ["text-placeholder", { color: "var(--placeholder-text-color)", },],
  ],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/,],
    },
  },
},)

import type { PresetUnoTheme, Rule, } from "unocss"
import { defineConfig, presetIcons, presetUno, } from "unocss"
import { ICON_PREFIX, } from "./src/constants"

const propertyMap = {
  text: "color",
  bg: "background-color",
  border: "border-color",
  outline: "outline-color",
}

interface CustomTheme extends PresetUnoTheme {
  colors: Record<string, string>
  textColors: Record<string, string>
  fontSizes: Record<string, { fontSize: string, lineHeight: string }>
}

function generateColorRules() {
  return Object.keys(propertyMap,).map(property => [
    new RegExp(`^${property}-(.*)$`,),
    ([, color,], { theme, }: { theme: CustomTheme },) => {
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
    textColors: {
      main: "var(--primary-text-color)",
      regular: "var(--regular-text-color)",
      secondary: "var(--secondary-text-color)",
      placeholder: "var(--placeholder-text-color)",
    },
    fontSizes: {
      base: { "font-size": "var(--font-size-base)", "line-height": "var(--line-height-base)", },
      lg: { "font-size": "var(--font-size-lg)", "line-height": "var(--line-height-base)", },
      xl: { "font-size": "var(--font-size-xl)", "line-height": "var(--line-height-base)", },
      sm: { "font-size": "var(--font-size-sm)", "line-height": "var(--line-height-base)", },
      xs: { "font-size": "var(--font-size-xs)", "line-height": "var(--line-height-base)", },
    },
  },
  rules: [
    ...generateColorRules(),
    [/^text-(.*)$/, (match, { theme, },) => {
      const [, name,] = match
      const color = (theme as CustomTheme).textColors?.[name]
      if (color)
        return { color, }
    },],
    [/^(?:text|font)-size-(.+)$/, (match, { theme, },) => {
      const [, name,] = match
      const size = (theme as CustomTheme).fontSizes?.[name]
      if (size)
        return size
    },],
  ],
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/,],
    },
  },
},)

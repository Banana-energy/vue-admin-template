import type { RouteMeta, } from "vue-router"

export function useI18nTitle(meta?: RouteMeta,) {
  const { localeState, } = useLocale()
  const { i18n, } = meta || {}
  return i18n?.[localeState.value] || meta?.title || "Please Set Title"
}

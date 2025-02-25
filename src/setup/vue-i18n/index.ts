import type { App, } from "vue"
import { LocaleEnum, useLocale, } from "@/hooks/useLocale.ts"
import { createI18n, } from "vue-i18n"

const { localeState, } = useLocale()
function createI18nOptions() {
  return {
    locale: localeState.value,
    fallbackLocale: LocaleEnum.ZH_CN,
  }
}

export const i18n = createI18n(createI18nOptions(),)

export function setupI18n(app: App<Element>,) {
  app.use(i18n,)
  app.provide("i18n", i18n,)
}

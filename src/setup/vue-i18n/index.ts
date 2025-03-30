import type { App, } from "vue"
import { LocaleEnum, useLocale, } from "@/hooks/useLocale.ts"
import { createI18n, } from "vue-i18n"

const { localeState, } = useLocale()

export type I18n = typeof i18n

export const i18n = createI18n({
  messages: {
    [LocaleEnum.ZH_CN]: {},
    [LocaleEnum.EN_US]: {},
  },
  locale: localeState.value,
  fallbackLocale: LocaleEnum.ZH_CN,
},)

export function setupI18n(app: App<Element>,) {
  app.use(i18n,)
  app.provide("i18n", i18n,)
}

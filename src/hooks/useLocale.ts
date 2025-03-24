import { getI18nMessage, } from "@/apis/i18n"
import { useI18n, } from "@/hooks/useI18n.ts"
import elEn from "element-plus/es/locale/lang/en"
import elZhCn from "element-plus/es/locale/lang/zh-cn"
import vxeEnUS from "vxe-table/lib/locale/lang/en-US"
import vxeZhCN from "vxe-table/lib/locale/lang/zh-CN"

export enum LocaleEnum {
  ZH_CN = "zh-CN",
  EN_US = "en-US",
}

export const localeOptions = [
  {
    label: "简体中文",
    value: LocaleEnum.ZH_CN,
  },
  {
    label: "English",
    value: LocaleEnum.EN_US,
  },
]

export const elLocales = {
  [LocaleEnum.ZH_CN]: elZhCn,
  [LocaleEnum.EN_US]: elEn,
}

export const vxeLocales = {
  [LocaleEnum.ZH_CN]: vxeZhCN,
  [LocaleEnum.EN_US]: vxeEnUS,
}

export interface Messages {
  [LocaleEnum.ZH_CN]?: Record<string, any>
  [LocaleEnum.EN_US]?: Record<string, any>
}

export const localeState = useLocalStorage<LocaleEnum>("locale", LocaleEnum.ZH_CN,)
export const messageState = reactive<Messages>({},)

async function fetchLocaleMessage(locale: LocaleEnum,) {
  try {
    const response = await fetch(`/static/locales/${locale}.json?t=${Date.now()}`,)
    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch local messages for locale ${locale}:`, error,)
    return {}
  }
}

async function fetchRemoteMessage(locale: LocaleEnum,) {
  const response = await getI18nMessage()
  if (response?.data) {
    return response.data[locale]
  }
  return null
}

export function useLocale() {
  async function setLocale(locale: LocaleEnum,) {
    localeState.value = locale
    if (messageState[locale]) {
      return
    }
    const { setLocaleMessage, } = useI18n()
    const remoteMsg = await fetchRemoteMessage(locale,)
    if (remoteMsg) {
      const mergedMessage = {
        ...remoteMsg,
        ...elLocales[locale],
        ...vxeLocales[locale],
      }
      setLocaleMessage(locale, mergedMessage,)
      messageState[locale] = mergedMessage
      return
    }
    const localMsg = await fetchLocaleMessage(locale,)
    const mergedMessage = {
      ...localMsg,
      ...elLocales[locale],
      ...vxeLocales[locale],
    }
    setLocaleMessage(locale, mergedMessage,)
    messageState[locale] = mergedMessage
  }

  return {
    setLocale,
    localeState,
  }
}

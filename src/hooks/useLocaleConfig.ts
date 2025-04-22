import { LocaleEnum, } from "@/hooks/useLocale.ts"

const localeConfigList = [LocaleEnum.ZH_CN, LocaleEnum.EN_US,]

// useLocalConfig 函数类型化
export function useLocaleConfig<T extends readonly unknown[],>(configList: T,): T[number] {
  const { localeState, } = useLocale()

  // 获取当前语言的索引
  const index = localeConfigList.findIndex(item => item === localeState.value,)

  // 返回对应的配置
  return configList[index] || {}
}

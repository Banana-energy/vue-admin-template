import type { ApiConfig, OptionItem, Options, Props, } from "./types.ts"
import { get, isEqual, isFunction, omit, } from "lodash-es"

async function generateUniqueId(apiConfig: ApiConfig, params: any,) {
  const { api, config, } = apiConfig
  const encoder = new TextEncoder()
  const data = encoder.encode(api.toString() + JSON.stringify(config,) + JSON.stringify(params,),)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data,)
  return Array.from(new Uint8Array(hashBuffer,),)
    .map(byte => byte.toString(16,).padStart(2, "0",),)
    .join("",)
}

const optionsStore = reactive<Record<string, {
  options: Options
  loading: boolean
}>>({},)

export function useOptions(props: Props,) {
  const { apiConfig, immediate, params, beforeFetch, afterFetch, cacheData, } = props
  const options = ref<unknown[]>([],)
  const loading = ref(false,)

  async function fetchOptions() {
    if (!apiConfig) {
      console.warn("请传入apiConfig",)
      return
    }
    const { api, } = apiConfig || {}
    if (!api || !isFunction(api,)) {
      console.warn("请传入正确的api",)
      return
    }
    const formatParams = await beforeFetch?.(params,)
    if (cacheData) {
      const cacheKey = await generateUniqueId(apiConfig, params,)
      if (optionsStore[cacheKey]) {
        watch(() => optionsStore[cacheKey].options, (value,) => {
          options.value = value
        },)
        options.value = optionsStore[cacheKey].options
        return
      }
      optionsStore[cacheKey] = {
        options: [],
        loading: true,
      }
      loading.value = true
      const data = await api(formatParams,)
      watchEffect(async() => {
        options.value = optionsStore[cacheKey].options = await afterFetch?.(data,) || []
      },)
      options.value = optionsStore[cacheKey].options = await afterFetch?.(data,) || []
      loading.value = optionsStore[cacheKey].loading = false
      return
    }
    loading.value = true
    const result = await api(formatParams,)
    options.value = await afterFetch?.(result,) || []
  }

  const formatOptions = computed(() => {
    const { apiConfig, } = props
    if (!apiConfig) {
      return []
    }
    const { config, } = apiConfig
    if (!config) {
      // 没有配置说明为一维数组
      return (options.value as string[] | number[]).map(e => ({
        label: e,
        value: e,
        disabled: false,
      }),)
    }
    const { label: labelField, value: valueField, children: childrenField, } = config
    function transformData(data: OptionItem[],): OptionItem[] {
      return data.map((item,) => {
        const value = get(item, valueField,)
        const label = get(item, labelField,)
        if (!childrenField) {
          return {
            label,
            value,
            ...omit(item, [labelField, valueField,],),
          }
        }
        return {
          ...omit(item, [labelField, valueField, childrenField,],),
          label,
          value,
          ...(item[childrenField]
            ? { children: transformData(item[childrenField],), }
            : {}),
        }
      },)
    }
    return transformData(options.value as OptionItem[],)
  },)

  watch(
    () => props.params,
    (value, oldValue,) => {
      if (isEqual(value, oldValue,)) {
        return
      }
      fetchOptions()
    },
    { deep: true, immediate, },
  )

  return {
    options,
    loading,
    formatOptions,
    fetchOptions,
  }
}

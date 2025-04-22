import type { ElCascaderProps as CascaderProps, } from "@/components/ElCascader"
import type { Awaitable, } from "@vueuse/core"
import type { CheckboxGroupProps, ISelectProps, } from "element-plus"
import type { ISelectV2Props, } from "element-plus/es/components/select-v2/src/defaults"
import type { Component, } from "vue"

export type ElSelectProps = Partial<Omit<ISelectProps, "modelValue">>
export type ElCheckboxGroupProps = Partial<Omit<CheckboxGroupProps, "modelValue">>
export type ElCascaderProps = Partial<Omit<CascaderProps, "modelValue" | "filterMethod">>
export type ElSelectV2Props = Partial<Omit<ISelectV2Props, "modelValue" | "autocomplete">>

interface FieldConfig {
  label: string
  value: string
  disabled?: string
  children?: string
}

export interface ApiConfig {
  config?: FieldConfig
  api: (params?: any) => Promise<unknown>
}

export interface OptionItem {
  children?: OptionItem[]
  disabled?: boolean
  label?: string | number
  value?: string | number
  [name: string]: any
}

export type Options = OptionItem[] | string[] | number[]

export type ModelValue = any[] | string | number | boolean | Record<string, any> | undefined

export type Props = {
  cacheKey?: string
  modelValue?: ModelValue
  /**
   * 组件
   */
  component?: Component
  childComponent?: Component
  /**
   * 接口配置
   */
  apiConfig?: ApiConfig
  /**
   * 是否立即执行
   */
  immediate?: boolean
  /**
   * 接口请求参数
   */
  params?: unknown
  /**
   * 接口请求之前的回调函数，参数为传入的参数，返回结果将作为接口参数
   */
  beforeFetch?: (params: any) => Awaitable<any>
  /**
   * 接口请求之后的回调函数，返回结果将作为 options 传递给formatOptions
   */
  afterFetch?: (params: any) => Awaitable<any[]>
  /**
   * 组件的v-model属性名，默认为modelValue，可自由修改
   */
  modelPropName?: string
  /**
   * 是否缓存数据
   */
  cacheData?: boolean
} & ElSelectProps & ElCheckboxGroupProps & ElSelectV2Props & ElCascaderProps

export const defaultProps = {
  modelPropName: "modelValue",
  component: () => ElSelect,
  params: () => ({}),
  immediate: true,
  beforeFetch: (params: unknown,) => params,
  afterFetch: (res?: NewResponseData<[]>,) => {
    if (!res?.data) {
      return []
    }
    const { data, } = res
    return data || []
  },
  apiConfig: undefined,
  cacheData: true,

  // ElCascader
  persistent: true,
  teleported: true,
  validateEvent: true,
}

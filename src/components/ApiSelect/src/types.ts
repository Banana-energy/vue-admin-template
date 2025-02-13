import type { Awaitable, } from "@vueuse/core"
import type { Component, } from "vue"

interface FieldConfig {
  label: string
  value: string
  disabled?: string
  children?: string
}

export interface ApiConfig {
  config?: FieldConfig
  api: (params?: unknown) => Promise<unknown>
}

export interface OptionItem {
  [name: string]: any
  children?: OptionItem[]
  disabled?: boolean
  label?: string
  value?: string
}

export type Options = OptionItem[] | string[] | number[]

export type ModelValue = any[] | string | number | boolean | Record<string, any>

export interface Props {
  /**
   * 组件
   */
  component?: Component
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
  checkboxButton?: boolean
}

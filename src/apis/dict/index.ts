import type { ApiConfig, } from "@/components/ApiSelect"
import { postJSON, } from "@/utils/fetch.ts"

export type DictKey =
/**
 * 美迈订单状态
 */
  "mwOrderStatus" |
  /**
   * 状态
   */
  "commonStatus" |
  /**
   * 平台站点店铺
   */
  "platAndSiteAndShop" |
  /**
   * 库存属性
   */
  "stockState" |
  /**
   * 平台
   */
  "platform" |
  /**
   * 站点
   */
  "site" |
  /**
   * 店铺
   */
  "shop" |
  /**
   * 收货国家
   */
  "addressCountry" |
  /**
   * 费用归属组织
   */
  "organizationName" |
  /**
   * 收货省州
   */
  "addressProvince" |
  /**
   * 收货城市
   */
  "addressCity" |
  /**
   * 发货仓库
   */
  "warehouse" |
  /**
   * 物流商
   */
  "logisticsProvider" |
  /**
   * 物流渠道
   */
  "logisticsChannel" |
  /**
   * 订单样式
   */
  "orderStyle" |
  /**
   * 订单颜色
   */
  "orderColor" |
  /**
   * 订单尺码
   */
  "orderSize" |
  /**
   * 订单类型
   */
  "orderKind" |
  /**
   * 发货方式
   */
  "shippingMethod" |
  /**
   * 订单状态
   */
  "orderStatus" |
  /**
   * 订单支付状态
   */
  "paymentStatus" |
  /**
   * 查询条件号码
   */
  "queryConditionNumber" |
  /**
   * 接入方式
   */
  "accessMode" |
  /**
   * 业务类型
   */
  "businessType" |
  /**
   * 订单子类型
   */
  "subOrderKind" |
  /**
   * 是否低价订单
   */
  "isLowPriceOrder" |
  /**
   * 时间类型（北京时间、市场时间）
   */
  "timeType" |
  /**
   * 起始、结束时间（平台下单时间、系统创建时间）
   */
  "startEndTime" |
  /**
   * 订购时间
   */
  "orderTime" |
  /**
   * 经销商名称
   */
  "distributorName"

export namespace DictAPI {
  export type Data = Record<DictKey, DictValue[]>

  export interface DictValue {
    /**
     * 传值
     */
    code?: string
    name?: string
    children?: DictValue[]
  }

  export type Response = NewResponseData<Data>
}

export function getDictList() {
  return postJSON<DictAPI.Response>({
    url: "/mmfc/mmfc-order-manager-rest/dict/getAllDictionary",
  },)
}

export namespace SignalDictAPI {
  export interface Params {
    code?: string
  }

  export interface Data {
    code?: string
    name?: string
    children?: Data[]
  }

  export type Request = Params
  export type Response = NewResponseData<Data[]>
}

export const signalDictApiConfig: ApiConfig = {
  api: getSignalDictList,
  config: {
    label: "name",
    value: "code",
    disabled: "disabled",
  },
}

export function getSignalDictList(params: SignalDictAPI.Request,) {
  return postJSON<SignalDictAPI.Response>({
    url: "/mmfc/mmfc-order-manager-rest/dict/getOneDictionary",
    params,
  },)
}

export namespace StyleColorSizeAPI {
  export enum Type {
    Style = 1,
    Color = 2,
    Size = 3,
  }

  export interface Params {
    /**
     * 返回类型，1、返回style，2、返回color，3、返回size
     * 1-style,2-color,3-size
     */
    backType?: number
    /**
     * color
     * colors的Code集合
     */
    colors?: string[]
    /**
     * 平台
     * 平台Code集合
     */
    platforms?: string[]
    /**
     * 站点
     * 店铺Code集合
     */
    shops?: string[]
    /**
     * 站点
     * 站点Code集合
     */
    sites?: string[]
    /**
     * size
     * sizes的Code集合
     */
    sizes?: string[]
    /**
     * style
     * styles的Code集合
     */
    styles?: string[]
  }

  export interface Data {
    code?: string
    name?: string
  }

  export type Request = Params
  export type Response = NewResponseData<Data[]>
}

export const apiConfig: ApiConfig = {
  api: getStyleColorSizeByType,
  config: {
    label: "name",
    value: "code",
    disabled: "disabled",
  },
}

export function getStyleColorSizeByType(data: StyleColorSizeAPI.Request,) {
  return postJSON<StyleColorSizeAPI.Response>({
    url: "/mmfc/mmfc-order-manager-rest/dict/getStyleOrColorOrSize",
    data,
  },)
}

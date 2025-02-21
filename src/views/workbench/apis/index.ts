import { get, } from "@/utils/fetch.ts"

export namespace ModelListPageAPI {
  export interface Params {
    /**
     * 关联的产品
     */
    productNumber?: string[]
    /**
     * Style(WMS)
     */
    styleWms?: string[]
    /**
     * 品牌
     */
    brand?: string[]
    /**
     * 编码
     */
    code?: string
    /**
     * 开发年份
     */
    developmentYear?: string[]
    /**
     * 结束时间
     */
    endTime?: string
    idList?: string[]
    /**
     * 区域
     */
    region?: string[]
    /**
     * 开始时间
     */
    startTime?: string
    /**
     * 启用状态（草稿，禁用，启用）
     * 启用状态
     */
    status?: string[]
  }
  export interface Row {
    /**
     * 供应商
     */
    assignedFactory?: string
    /**
     * 品牌
     */
    brand?: string
    /**
     * 编码
     */
    code?: string
    /**
     * 创建人
     */
    createById?: number
    /**
     * 创建时间
     */
    createTime?: string
    delFlag?: number
    /**
     * 开发年份
     */
    developmentYear?: string
    /**
     * 头型
     */
    head?: string
    /**
     * 跟高(mm)
     */
    heelHigh?: number
    /**
     * 根底id
     */
    heelId?: number
    /**
     * 跟高
     */
    high?: string
    id?: number
    /**
     * 楦型id数组
     */
    lastId?: number[]
    /**
     * 操作人
     */
    modifyById?: number
    /**
     * 操作时间
     */
    modifyTime?: string
    /**
     * 跟型
     */
    pattern?: string
    /**
     * 关联的产品
     */
    productNumber?: string
    /**
     * 区域
     */
    region?: string
    /**
     * 备注
     */
    remark?: string
    /**
     * 启用状态（草稿，禁用，启用）
     * 启用状态
     */
    status?: string
    /**
     * 启用状态code
     */
    statusCode?: string
    statusEnum?: string
    /**
     * 适用人群
     */
    targetAudience?: string
    /**
     * 型体缩略图
     */
    thumbnail?: BaseFileDTO
  }
  export type List = Row[]
  export type Response = PageResponseData<Row>
  export type Request = Params & PageParams
}

export function getModelListByPage(params: ModelListPageAPI.Request,) {
  return get<ModelListPageAPI.Response>({
    url: "/pdm-base/model/page",
    params,
  },)
}

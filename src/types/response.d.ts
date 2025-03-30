declare global {
  type ItemName<T,> = T & {
    [key in `${keyof T}ItemName`]?: string
  }

  /**
   * 基本的响应数据结构的接口。
   */
  interface BasicResponseData {
    /** 返回标记：成功标记=0，其余都是失败 */
    code: string
    /** 响应描述 */
    msg: string
    /** 表示请求是否成功 */
    isSuccess: boolean
  }

  /**
   * 通用的响应数据类型。
   * 结合基本响应数据和泛型参数 T 指定的数据类型。
   * @template T 响应中的数据类型
   */
  type ResponseData<T,> = BasicResponseData & {
    datas: T
  }

  interface RawResponse {
    rawData: true
  }

  interface NewBasicResponseData {
    /** 返回标记：成功标记=0001，其余都是失败 */
    responseCode: string
    /** 响应描述 */
    responseDesc: string
    /** 表示请求是否成功 */
    success: boolean
  }

  type NewResponseData<T,> = NewBasicResponseData & {
    data: T
  }

  /**
   * 基础分页信息接口。
   * 包含分页所需的基本属性。
   */
  interface BasicPage {
    /** 当前页码 */
    current: number
    /** 每页显示的记录数 */
    size: number
    /** 总记录数 */
    total: number
    /** 总页数 */
    pages?: number
  }

  interface NewBasicPage {
    currPage: number
    pageSize: number
    totalCount: number
    totalPage?: number
  }

  /**
   * 分页请求参数的接口。
   * 用于指定分页请求的当前页和页大小。
   */
  interface PageParams {
    /** 当前页码 */
    current: number
    /** 每页显示的记录数 */
    size: number
  }

  interface ListResponseData<T,> {
    /** 数据列表 */
    records: T[]
    pager: BasicPage
  }

  type NewListResponseData<T,> = {
    /** 数据列表 */
    list: T[]
  } & NewBasicPage

  type PageResponseData<T,> = BasicResponseData & {
    datas: ListResponseData<T>
  }

  type NewPageResponseData<T,> = NewBasicResponseData & {
    data: NewListResponseData<T>
  }
}

export {}

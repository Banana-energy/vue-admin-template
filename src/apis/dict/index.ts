import { get, } from "@/utils/fetch.ts"

export type DictKey =
  /** 尺码库性别 */
  | "SIZE_SEX"
  /** 尺码库分类 */
  | "SIZE_TYPE"
  /** 楦型楦头帮高 */
  | "LAST_HEIGHT"
  /** 楦型楦头市场 */
  | "LAST_MARKET"
  /** 楦型性别 */
  | "LAST_SEX"
  /** 楦型楦头类别 */
  | "LAST_TYPE"
  /** 基础库区域 */
  | "COMMON_REGION"
  /** 基础库开发季节 */
  | "COMMON_DEV_SEASON"
  /** 跟底分类 */
  | "HEEL_BOTTOM_TYPE"
  /** 材料材质 */
  | "MATERIAL_TEXTURE"
  /** 材料单位 */
  | "MATERIAL_UNIT"
  /** 模具类型 */
  | "MOLD_TYPE"
  /** 模具开制阶段 */
  | "MOLD_STAGE"
  /** 鞋底材质 */
  | "SOLE_MATERIAL"
  /** 开模类型 */
  | "MOLD_OPEN_TYPE"
  /** 模具性质 */
  | "MOLD_NATURE"
  /** 跟底头型 */
  | "HEEL_HEAD"
  /** 跟底跟型 */
  | "HEEL_PATTERN"
  /** 跟底跟高 */
  | "HEEL_HIGH"
  /** 产品适用人群 */
  | "PRODUCT_PEOPLE"
  /** 产品楦型标准 */
  | "PRODUCT_LAST_STANDARD"
  /** 基础库上市季节 */
  | "COMMON_MARKET_SEASON"
  /** 产品适用季节 */
  | "PRODUCT_SUITABLE_SEASON"
  /** 产品定位 */
  | "PRODUCT_POSITION"
  /** 侵权风险 */
  | "INFRINGEMENT_RISK"
  /** 维权力度 */
  | "RIGHTS_PROTECTION"
  /** 产品风格 */
  | "PRODUCT_STYLE"
  /** 基础库款式结构 */
  | "COMMON_STYLE_STRUCTURE"
  /** 供应商 */
  | "SUPPLIER"
  /** 特殊的材料分类 */
  | "SPECIAL_MATERIAL_CATEGORY"
  /** 产品开发类型 */
  | "PRODUCT_DEV_TYPE"
  /** 产品阶段 */
  | "PRODUCT_STAGE"
  /** 产品任务节点 */
  | "PRODUCT_TASK_NOTE"
  /** 产品数据状态 */
  | "PRODUCT_DATA_STATUS"
  /** 产品开发渠道 */
  | "PRODUCT_DEV_CHANNELS"
  /** 产品儿童人群 */
  | "PRODUCT_CHILDREN"
  /** 产品儿童年龄段 */
  | "PRODUCT_CHILDREN_AGE"
  /** 产品款式定位 */
  | "PRODUCT_STYLE_POSITIONING"
  /** 产品开发策略 */
  | "PRODUCT_DEV_STRATEGY"
  /** 产品开口类型 */
  | "PRODUCT_OPEN_TYPE"
  /** 产品闭口方式 */
  | "PRODUCT_CLOSE_TYPE"
  /** 产品安全鞋 */
  | "PRODUCT_SAFE_SHOE"
  /** arch type */
  | "PRODUCT_ARCH_TYPE"
  /** 产品防水级别 */
  | "PRODUCT_WATERPROOF_LEVEL"
  /** 产品场景 */
  | "PRODUCT_SCENES"
  /** 产品楦底类型 */
  | "PRODUCT_LAST_HEEL_TYPE"
  /** 材料宽幅 */
  | "MATERIAL_BREADTH"
  /** 材料厚度 */
  | "MATERIAL_THINKNESS"
  /** 材料克重 */
  | "MATERIAL_GRAM_WEIGHT"
  /** 材料纹路 */
  | "MATERIAL_GRAIN"
  /** 底材材质 */
  | "SUBSTRATE_MATERIAL"
  /** 材料工艺描述 */
  | "MATERIAL_PROCESS_DESCTIPTION"
  /** 产品配色类型 */
  | "PRODUCT_COLOR_TYPE"
  /** 产品包装类型 */
  | "PRODUCT_PACKAGE_TYPE"
  /** 产品内里标签 */
  | "PRODUCT_INSIDE_LABEL"
  /** 基础库计量单位 */
  | "COMMON_MEASURE_UNIT"
  /** 产品装箱数（箱规） */
  | "PRODUCT_BOX_NUMBER"
  /** 产品主渠道标识 */
  | "PRODUCT_CHANNEL_IDENTIFICATION"
  /** 产品鞋底工业 */
  | "PRODUCT_SOLE_CRAFT"
  /** 基础库是否 */
  | "COMMON_YES_NO"
  /** 侵权排查阶段 */
  | "INFRINGEMENT_PHASE"
  /** 检索途径 */
  | "INFRINGEMENT_SEARCH_WAY"
  /** 通过/不通过 */
  | "COMMON_PASS_FAIL"
  /** 是否植绒 */
  | "FLOCKING_YES_NO"
  /** 是否有功能吊牌 */
  | "PRODUCT_FUNCTION_TAG"
  /** 检索分类 */
  | "SEARCH_CATEGORY"
  /** 社媒平台 */
  | "SM_PLATFORM"
  /** 社媒账号类型 */
  | "SM_ACCOUNT_TYPE"
  /** 社媒粉丝量级 */
  | "SM_FANS_SCALE"
  /** 社媒标签类型 */
  | "SM_TAG_TYPE"
  /** 社媒数据获取来源 */
  | "SM_DATA_SOURCE"
  /** 社媒产品大类 */
  | "SM_PRODUCT_BIG_CATE"
  /** 社媒热度指标 */
  | "SM_HEAT_INDEX"
  /** 过踝过膝 */
  | "COVER KNEE OR ANKLE"
  /** 元素 */
  | "PRODUCT_POPULAT_ELEMENTS"
  /** 开发模式 */
  | "PRODUCT_DEV_MODEL"
  /** 打样环节 */
  | "SAMPLE_PROCESS"
  /** 开发年份 */
  | "COMMON_DEV_YEAR"
  /** CT归属 */
  | "COMBAT_TEAM"
  /** 材料供应商性质 */
  | "MATERIAL_VENDOR_NATURE"
  /** 材料供应商类别 */
  | "MATERIAL_VENDOR_TYPE"
  /** 部位 */
  | "MATERIAL_PART"
  /** 产品衍生类型 */
  | "DERIVED_TYPE"
  /** 产品系列 */
  | "PRODUCT_SERIES"

export namespace DictAPI {
  export interface Data {
    dictItem?: DictKey
    dictValueList?: DictValue[]
    id?: number
  }

  export interface DictValue {
    /**
     * 展示值-中文
     */
    dictCnName?: string
    /**
     * 展示值-英文
     */
    dictEnName?: string
    /**
     * 传值
     */
    dictValue?: string
    id?: number
  }

  export type Response = ResponseData<Data[]>
}

export function getDictList() {
  return get<DictAPI.Response>({
    url: "/pdm-base/dict/value/all",
  },)
}

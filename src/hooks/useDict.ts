import type { DictAPI, DictKey, } from "@/apis/dict"
import { getDictList, } from "@/apis/dict"
import { transformOptionsToMap, } from "@/utils"
import { camelCase, } from "lodash-es"

// 模板字符串类型：将下划线转为小驼峰
export type ToCamelCase<S extends string, > = S extends `${infer Head}_${infer Tail}` // 判断是否有下划线
  ? `${Lowercase<Head>}${Capitalize<ToCamelCase<Tail>>}` // 递归处理下划线后的部分
  : Lowercase<S> // 如果没有下划线，直接转小写
type AppendSuffix<S extends string, Suffix extends "List" | "Map", > = `${ToCamelCase<S>}${Suffix}`

type DictList = {
  [key in AppendSuffix<DictKey, "List">]?: DictAPI.DictValue[]
}

type DictMap = {
  [key in AppendSuffix<DictKey, "Map">]?: Record<string, string | number | undefined>
}

export type DictState = DictList & DictMap & {
  fetching: boolean
  fetched: boolean
}

export const dictState = reactive<DictState>({
  fetching: false,
  fetched: false,
},)

export function useDict() {
  async function fetchDictList() {
    if (dictState.fetching || dictState.fetched) {
      return dictState
    }
    dictState.fetching = true
    const result = await getDictList()
    dictState.fetching = false
    if (result?.datas) {
      const { datas, } = result
      datas.forEach((item,) => {
        const key = camelCase(item.dictItem,) as ToCamelCase<DictKey>
        if (key) {
          dictState[`${key}List`] = item.dictValueList
          dictState[`${key}Map`] = transformOptionsToMap(item.dictValueList as Record<string, string | number | undefined>[], {
            keyField: "dictValue",
            valueField: "dictCnName",
          },)
        }
      },)
    }
    return dictState
  }

  fetchDictList()

  return {
    dictState,
    fetchDictList,
  }
}

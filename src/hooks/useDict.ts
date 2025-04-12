import type { DictAPI, DictKey, } from "@/apis/dict"
import { getDictList, } from "@/apis/dict"
import { transformOptionsToMap, } from "@/utils"

type AppendSuffix<S extends string, Suffix extends "List" | "Map", > = `${S}${Suffix}`

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
    if (result?.data) {
      dictState.fetched = true
      const { data, } = result
      const dictKeys = Object.keys(data,) as DictKey[]
      dictKeys.forEach((item,) => {
        const key = item
        if (key) {
          dictState[`${key}List`] = data[item]
          dictState[`${key}Map`] = transformOptionsToMap(data[item] as Record<string, string>[], {
            keyField: "code",
            valueField: "name",
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

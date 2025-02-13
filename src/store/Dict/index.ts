import type { DictAPI, } from "@/apis/dict"
import { defineStore, } from "pinia"

export const useDictStore = defineStore("dict", {
  state: (): DictAPI.DictState => {
    return {
      fetched: false,
    }
  },
},)

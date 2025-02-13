<script setup lang="ts">
import type { DictAPI, } from "@/apis/dict"
import type { ApiConfig, ApiSelectProps, ModelValue, } from "@/components/ApiSelect"
import { getDictList, } from "@/apis/dict"

type Props = Pick<ApiSelectProps, "component" | "apiConfig" | "immediate" | "params" | "cacheData" | "modelPropName"> & {
  dictCode: DictAPI.DictKey
  modelValue: ModelValue
}

const props = withDefaults(defineProps<Props>(), {
  modelPropName: "modelValue",
  component: () => ElSelect,
  params: () => ({}),
  immediate: true,
  cacheData: true,
},)

const attrs = useAttrs()

const bindProps = computed(() => {
  return {
    ...attrs,
    ...props,
  }
},)

const apiConfig: ApiConfig = {
  api: getDictList,
  config: {
    label: "dictCnName",
    value: "dictValue",
    disabled: "disabled",
  },
}

function afterFetch(data: DictAPI.Response,) {
  const currentData = data.datas.find(item => item.dictItem === props.dictCode,)
  return currentData?.dictValueList || []
}
</script>

<template>
  <ApiSelect
    v-bind="bindProps"
    :after-fetch="afterFetch"
    :api-config="apiConfig"
    cache-data
  />
</template>

<style scoped lang="scss">

</style>

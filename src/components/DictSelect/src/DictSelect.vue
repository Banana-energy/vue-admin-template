<script lang="ts" setup>
import type { DictAPI, } from "@/apis/dict"
import type { ApiConfig, ApiSelectProps, ModelValue, } from "@/components/ApiSelect"
import { getDictList, } from "@/apis/dict"
import { omit, } from "lodash-es"

defineOptions({
  name: "DictSelect",
},)

const props = withDefaults(defineProps<Props>(), {
  modelPropName: "modelValue",
  component: () => ElSelect,
  params: () => ({}),
  immediate: true,
  cacheData: true,
},)

type Props = ApiSelectProps & {
  dictCode: DictAPI.DictKey
  modelValue: ModelValue
}

const attrs = useAttrs()

const bindProps = computed<Props>(() => {
  const omitKeys: (keyof Props)[] = ["apiConfig", "cacheData", "dictCode",]
  const omitProps = omit(props, omitKeys,)
  return {
    ...attrs,
    ...omitProps,
    afterFetch: props.afterFetch || afterFetch,
  } as Props
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
    :api-config="apiConfig"
    cache-data
    v-bind="bindProps"
  />
</template>

<style lang="scss" scoped>

</style>

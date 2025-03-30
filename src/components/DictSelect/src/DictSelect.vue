<script lang="ts" setup>
import type { DictKey, } from "@/apis/dict"
import type { ApiConfig, ApiSelectProps, ModelValue, } from "@/components/ApiSelect"
import type { DictState, ToCamelCase, } from "@/hooks/useDict.ts"
import { useDict, } from "@/hooks/useDict.ts"
import { camelCase, omit, } from "lodash-es"

defineOptions({
  name: "DictSelect",
},)

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  modelPropName: "modelValue",
  component: () => ElSelect,
  params: () => ({}),
  immediate: true,
  cacheData: true,
},)
const emits = defineEmits<{
  (event: "update:modelValue", value: ModelValue): void
}>()
type Props = ApiSelectProps & {
  dictCode: DictKey
}

const attrs: Record<string, unknown> = useAttrs()

const { fetchDictList, } = useDict()

const apiConfig: ApiConfig = {
  api: fetchDictList,
  config: {
    label: "dictCnName",
    value: "dictValue",
    disabled: "disabled",
  },
}

const bindProps = computed<ApiSelectProps>(() => {
  const omitKeys: (keyof Props)[] = ["apiConfig", "cacheData", "dictCode", "modelValue",]
  const omitProps = omit(props, omitKeys,)
  return {
    ...attrs,
    ...omitProps,
    apiConfig,
    cacheData: true,
    afterFetch: props.afterFetch || afterFetch,
  }
},)

function afterFetch(data?: DictState,) {
  const key = camelCase(props.dictCode,) as ToCamelCase<DictKey>
  const currentData = data?.[`${key}List`]
  return currentData || []
}
</script>

<template>
  <ApiSelect :model-value="modelValue" v-bind="bindProps" @update:model-value="val => emits('update:modelValue', val)" />
</template>

<style lang="scss" scoped>

</style>

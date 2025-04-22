<script lang="ts" setup>
import type { DictKey, } from "@/apis/dict"
import type { ApiConfig, ApiSelectProps, ModelValue, } from "@/components/ApiSelect"
import type { DictState, } from "@/hooks/useDict.ts"
import { ApiSelect, } from "@/components/ApiSelect"
import { useDict, } from "@/hooks/useDict.ts"
import { omit, } from "lodash-es"

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
    label: "name",
    value: "code",
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
    cacheKey: props.dictCode,
    cacheData: true,
    afterFetch: props.afterFetch || afterFetch,
  }
},)

function afterFetch(data?: DictState,) {
  const key = props.dictCode
  const currentData = data?.[`${key}List`]
  return currentData || []
}

const apiSelectRef = ref<InstanceType<typeof ApiSelect>>()

const componentRef = computed(() => {
  return apiSelectRef.value?.componentRef
},)

defineExpose({
  componentRef,
},)
</script>

<template>
  <ApiSelect
    ref="apiSelectRef"
    v-bind="bindProps"
    :model-value="modelValue"
    @update:model-value="val => emits('update:modelValue', val)"
  />
</template>

<style lang="scss" scoped>

</style>

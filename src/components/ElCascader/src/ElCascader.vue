<script lang="ts" setup>
import type { CascaderEmits, CascaderNode, } from "element-plus"
import type { ElCascaderInstance, } from "./types.ts"
import { ElCascader, } from "element-plus"
import "element-plus/es/components/cascader/style/index"

type Props = /* @vue-ignore */ ElCascaderInstance["$props"]

defineOptions({
  name: "ElCascader",
},)

const props = defineProps<Props>()
const emits = defineEmits<CascaderEmits>()

function defaultFilterMethod(node: CascaderNode, keyword: string,) {
  return node.text.toLowerCase().includes(keyword.toLowerCase(),)
}

const attrs = useAttrs()

const bindProps = computed(() => {
  const { filterMethod, ...rest } = props

  return {
    ...attrs,
    ...rest,
    filterMethod: filterMethod || defaultFilterMethod,
  }
},)
</script>

<template>
  <ElCascader
    :model-value="props.modelValue"
    v-bind="bindProps"
    @change="val => emits('change', val)"
    @update:model-value="val => emits('update:model-value', val)"
  />
</template>

<style lang="scss" scoped>
</style>

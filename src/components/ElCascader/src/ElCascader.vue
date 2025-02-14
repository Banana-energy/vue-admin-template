<script lang="ts" setup>
import type { CascaderNode, } from "element-plus"
import type { ElCascaderInstance, } from "./types.ts"
import { ElCascader, } from "element-plus"
import "element-plus/es/components/cascader/style/index"

type Props = /* @vue-ignore */ ElCascaderInstance["$props"]

const props = defineProps<Props>()

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
  <ElCascader v-bind="bindProps" />
</template>

<style lang="scss" scoped>
</style>

<script setup lang="ts">
import type { CascaderNode, } from "element-plus"
import type { ElCascaderInstance, } from "./types.ts"
import { ElCascader, } from "element-plus"

const props = withDefaults(defineProps<ElCascaderInstance["$props"]>(), {
  filterMethod: (node: CascaderNode, keyword: string,) =>
    node.text.toLowerCase().includes(keyword.toLowerCase(),),
},)
</script>

<template>
  <ElCascader v-bind="props" />
</template>

<style scoped lang="scss">

</style>

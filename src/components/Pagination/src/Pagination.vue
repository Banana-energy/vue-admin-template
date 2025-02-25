<script lang="ts" setup>
import type { PaginationProps, } from "element-plus"
import type { Props, } from "./types.ts"
import { noop, omit, } from "lodash-es"

defineOptions({
  name: "Pagination",
},)

const props = withDefaults(defineProps<Props>(), {
  layout: `->, prev, pager, next, sizes`,
  pageSizes: () => [10, 20, 30, 40, 50, 100, 500, 1000,],
  config: () => ["current", "size", "total",],
},)
const emits = defineEmits<{
  (e: "change", currentPage: number, pageSize: number,): void
}>()
const attrs: Record<string, unknown> = useAttrs()

const bindProps = computed<Partial<PaginationProps>>(() => {
  const { pager, config, } = props
  const omitKeys = ["pager", "config",]
  const omitProps = omit(props, omitKeys,)
  const [current, size, total,] = config
  return {
    ...attrs,
    ...omitProps,
    "currentPage": pager[current],
    "pageSize": pager[size],
    "total": pager[total],
    onChange,
    "onUpdate:currentPage": noop,
    "onUpdate:pageSize": noop,
  }
},)

function onChange(currentPage: number, pageSize: number,) {
  emits("change", currentPage, pageSize,)
}
</script>

<template>
  <ElPagination
    class="py-4 bg-white"
    v-bind="bindProps"
    @change="onChange"
  />
</template>

<style lang="scss" scoped>

</style>

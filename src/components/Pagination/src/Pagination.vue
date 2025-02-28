<script lang="ts" setup>
import type { PaginationProps, } from "element-plus"
import type { Props, } from "./types.ts"
import { omit, } from "lodash-es"

defineOptions({
  name: "Pagination",
},)

const props = withDefaults(defineProps<Props>(), {
  layout: `->, prev, pager, next, sizes`,
  pageSizes: () => [10, 20, 30, 40, 50, 100, 500, 1000,],
},)
const emits = defineEmits<{
  (e: "change", pager: BasicPage,): void
}>()
const attrs: Record<string, unknown> = useAttrs()

const bindProps = computed<Partial<PaginationProps>>(() => {
  const { pager, } = props
  const omitKeys = ["pager",]
  const omitProps = omit(props, omitKeys,)
  return {
    ...attrs,
    ...omitProps,
    "currentPage": pager.current,
    "pageSize": pager.size,
    "total": pager.total,
    "onUpdate:currentPage": (val: number,) => {
      emits("change", {
        ...pager,
        current: val,
      },)
    },
    "onUpdate:pageSize": (val: number,) => {
      emits("change", {
        ...pager,
        size: val,
      },)
    },
  }
},)
</script>

<template>
  <ElPagination
    class="px-2 py-4 bg-white"
    v-bind="bindProps"
  />
</template>

<style lang="scss" scoped>

</style>

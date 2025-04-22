<script lang="ts" setup>
import type { PaginationProps, } from "element-plus"
import type { Props, } from "./types.ts"
import { omit, } from "lodash-es"

defineOptions({
  name: "Pagination",
},)

const props = withDefaults(defineProps<Props>(), {
  layout: `total, slot, ->, prev, pager, next, sizes`,
  pageSizes: () => [10, 20, 30, 40, 50, 100, 500, 1000,],
},)
const emits = defineEmits<{
  (e: "change", pager: NewBasicPage,): void
}>()
const attrs: Record<string, unknown> = useAttrs()

const bindProps = computed<Partial<PaginationProps>>(() => {
  const { pager, pageSizes, } = props
  const omitKeys = ["pager",]
  const omitProps = omit(props, omitKeys,)
  const _pageSizes = pageSizes.slice()
  if (pager.pageSize && !props.pageSizes.includes(pager.pageSize,)) {
    _pageSizes.push(pager.pageSize,)
    _pageSizes.sort((a, b,) => a - b,)
  }
  return {
    ...attrs,
    ...omitProps,
    "pageSizes": _pageSizes,
    "currentPage": pager.currPage,
    "pageSize": pager.pageSize,
    "total": pager.totalCount,
    "onUpdate:currentPage": (val: number,) => {
      emits("change", {
        ...pager,
        currPage: val,
      },)
    },
    "onUpdate:pageSize": (val: number,) => {
      emits("change", {
        ...pager,
        pageSize: val,
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

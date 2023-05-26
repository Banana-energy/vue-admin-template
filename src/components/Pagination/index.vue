<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      v-bind="$attrs"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :total="total"
      :background="background"
    />
  </div>
</template>

<script lang="ts" setup name="Pagination">
type pageInfo = {
  page: number;
  limit: number;
};

const props = defineProps({
  total: {
    require: true,
    type: Number,
  },
  page: {
    default: 1,
    type: Number,
  },
  limit: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 50],
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  background: {
    type: Boolean,
    default: true,
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  hidden: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits<{
  (e: "update:page", page: number): void;
  (e: "update:limit", limit: number): void;
  (e: "pagination", pageInfo: pageInfo): void;
}>();

const currentPage = computed({
  get() {
    const { page } = toRefs(props);
    return page.value;
  },
  set(val: number) {
    emits("update:page", val);
    handleCurrentChange(val);
  },
});

const pageSize = computed({
  get() {
    const { limit } = toRefs(props);
    return limit.value;
  },
  set(val: number) {
    emits("update:limit", val);
    handleSizeChange(val);
  },
});

const handleSizeChange = (val: number) => {
  emits("pagination", {
    page: currentPage.value,
    limit: val,
  });
};

const handleCurrentChange = (val: number) => {
  emits("pagination", {
    page: val,
    limit: pageSize.value,
  });
};
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}

.pagination-container.hidden {
  display: none;
}
</style>

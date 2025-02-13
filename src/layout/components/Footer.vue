<script setup lang="ts">
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("footer",)

const appStore = useAppStore()

const title = computed(() => appStore.getTitle,)
</script>

<template>
  <div
    :class="prefixCls"
    class="h-[var(--app-footer-height)] overflow-hidden bg-[var(--app-content-bg-color)] text-center text-[var(--el-text-color-placeholder)] leading-[var(--app-footer-height)] dark:bg-[var(--el-bg-color)]"
  >
    Copyright ©2021-present {{ title }}
  </div>
</template>

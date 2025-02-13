<script setup lang="ts">
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"
import { computed, unref, } from "vue"

defineProps<{
  color: string
}>()

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("collapse",)

const appStore = useAppStore()

const collapse = computed(() => appStore.getCollapse,)

function toggleCollapse() {
  const collapsed = unref(collapse,)
  appStore.setCollapse(!collapsed,)
}
</script>

<template>
  <div :class="prefixCls" @click="toggleCollapse">
    <Icon
      :color="color"
      :icon="collapse ? 'vi-ant-design:menu-unfold-outlined' : 'vi-ant-design:menu-fold-outlined'"
      :size="18"
      class="cursor-pointer"
    />
  </div>
</template>

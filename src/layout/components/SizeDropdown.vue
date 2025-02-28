<script lang="ts" setup>
import type { ComponentSize, } from "element-plus"
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"
import { computed, } from "vue"

defineProps<{
  color: string
}>()

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("size-dropdown",)

const appStore = useAppStore()

const sizeMap = computed(() => appStore.sizeMap,)

function setCurrentSize(size: ComponentSize,) {
  appStore.setCurrentSize(size,)
}
</script>

<template>
  <ElDropdown :class="prefixCls" trigger="click" @command="setCurrentSize">
    <Icon
      :color="color"
      :size="18"
      class="cursor-pointer"
      icon="vi-mdi:format-size"
    />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in sizeMap" :key="item" :command="item">
          {{ item }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

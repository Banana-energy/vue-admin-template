<script setup lang="ts">
import { Icon, } from "@/components/Icon"
import { useDesign, } from "@/hooks/useDesign"
import { useFullscreen, } from "@vueuse/core"

defineProps<{
  color: string
}>()

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("screenFull",)

const { toggle, isFullscreen, } = useFullscreen()
</script>

<template>
  <div :class="prefixCls" @click="toggle">
    <Icon
      :color="color"
      :icon="isFullscreen ? 'vi-zmdi:fullscreen-exit' : 'vi-zmdi:fullscreen'"
      :size="18"
    />
  </div>
</template>

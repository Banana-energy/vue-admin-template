<script setup lang="ts">
import type { ComponentSize, } from "element-plus"
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"
import { setCssVar, } from "@/utils"
import { useWindowSize, } from "@vueuse/core"
import { ElConfigProvider, } from "element-plus"

const props = withDefaults(defineProps<{
  size: ComponentSize
}>(), {
  size: "default",
},)

const { variables, } = useDesign()

const appStore = useAppStore()

provide("configGlobal", props,)

// 初始化所有主题色
onMounted(() => {
  appStore.setCssVarTheme()
},)

const { width, } = useWindowSize()

// 监听窗口变化
watch(
  () => width.value,
  (width: number,) => {
    if (width < 768) {
      !appStore.getMobile ? appStore.setMobile(true,) : undefined
      setCssVar("--left-menu-min-width", "0",)
      appStore.setCollapse(true,)
      appStore.getLayout !== "classic" ? appStore.setLayout("classic",) : undefined
    } else {
      appStore.getMobile ? appStore.setMobile(false,) : undefined
      setCssVar("--left-menu-min-width", "64px",)
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <ElConfigProvider
    :message="{ max: 1 }"
    :namespace="variables.elNamespace"
    :size="size"
  >
    <slot />
  </ElConfigProvider>
</template>

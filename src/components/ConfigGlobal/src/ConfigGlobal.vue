<script lang="ts" setup>
import type { ComponentSize, } from "element-plus"
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"
import { setCssVar, } from "@/utils"
import { useWindowSize, } from "@vueuse/core"

const props = withDefaults(defineProps<{
  size?: ComponentSize
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
      if (!appStore.getMobile) {
        appStore.setMobile(true,)
      }
      setCssVar("--left-menu-min-width", "0",)
      appStore.setCollapse(true,)
      if (appStore.getLayout !== "classic") {
        appStore.setLayout("classic",)
      }
    } else {
      if (appStore.getMobile) {
        appStore.setMobile(false,)
      }
      setCssVar("--left-menu-min-width", "64px",)
    }
  },
  {
    immediate: true,
  },
)

const { localeState, } = useLocale()

const elLocale = computed(() => {
  return elLocales[localeState.value]
},)
</script>

<template>
  <ElConfigProvider
    :locale="elLocale"
    :message="{ max: 1 }"
    :namespace="variables.elNamespace"
    :size="size"
  >
    <slot />
  </ElConfigProvider>
</template>

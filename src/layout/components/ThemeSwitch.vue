<script setup lang="ts">
import { useDesign, } from "@/hooks/useDesign"
import { useIcon, } from "@/hooks/useIcon"
import { useAppStore, } from "@/store/App"
import { ref, } from "vue"

const emit = defineEmits(["change",],)

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("theme-switch",)

const Sun = useIcon({ icon: "vi-emojione-monotone:sun", color: "#fde047", },)

const CrescentMoon = useIcon({ icon: "vi-emojione-monotone:crescent-moon", color: "#fde047", },)

const appStore = useAppStore()

// 初始化获取是否是暗黑主题
const isDark = ref(appStore.getIsDark,)

// 设置switch的背景颜色
const blackColor = "var(--el-color-black)"

function themeChange(val: boolean | string | number,) {
  appStore.setIsDark(!!val,)
  emit("change", !!val,)
}
</script>

<template>
  <ElSwitch
    v-model="isDark"
    :active-color="blackColor"
    :active-icon="Sun"
    :border-color="blackColor"
    :class="prefixCls"
    :inactive-color="blackColor"
    :inactive-icon="CrescentMoon"
    inline-prompt
    @change="themeChange"
  />
</template>

<style lang="scss" scoped>
:deep(.el-switch__core .el-switch__inner .is-icon) {
  overflow: visible;
}
</style>

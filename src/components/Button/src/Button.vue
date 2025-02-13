<script setup lang="ts">
import type { ButtonType, ComponentSize, } from "element-plus"
import type { Component, PropType, } from "vue"
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"

const props = defineProps({
  size: {
    type: String as PropType<ComponentSize>,
    default: undefined,
  },
  type: {
    type: String as PropType<ButtonType>,
    default: "default",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  plain: {
    type: Boolean,
    default: false,
  },
  text: {
    type: Boolean,
    default: false,
  },
  bg: {
    type: Boolean,
    default: false,
  },
  link: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Boolean,
    default: false,
  },
  circle: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingIcon: {
    type: [String, Object,] as PropType<string | Component>,
    default: undefined,
  },
  icon: {
    type: [String, Object,] as PropType<string | Component>,
    default: undefined,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  nativeType: {
    type: String as PropType<"button" | "submit" | "reset">,
    default: "button",
  },
  autoInsertSpace: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "",
  },
  darker: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: [String, Object,] as PropType<string | Component>,
    default: "button",
  },
},)

const emits = defineEmits(["click",],)

const appStore = useAppStore()

const getTheme = computed(() => appStore.getTheme,)

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("button",)

const color = computed(() => {
  const { type, link, } = props
  if (type === "primary" && !link) {
    return unref(getTheme,).elColorPrimary
  }
  return ""
},)

const style = computed(() => {
  const { type, link, } = props
  if (type === "primary" && !link) {
    return "--el-button-text-color: #fff; --el-button-hover-text-color: #fff"
  }
  return ""
},)
</script>

<template>
  <ElButton
    :class="`${prefixCls} color-#fff`"
    v-bind="{ ...props }"
    :color="color"
    :style="style"
    @click="() => emits('click')"
  >
    <slot />
    <slot name="icon" />
    <slot name="loading" />
  </ElButton>
</template>

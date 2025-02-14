<script lang="ts" setup>
import type { IconTypes, } from "@/components/Icon"
import { ICON_PREFIX, } from "@/constants"
import { useDesign, } from "@/hooks/useDesign"
import { Icon, } from "@iconify/vue"
import { ElIcon, } from "element-plus"
import { computed, unref, } from "vue"

defineOptions({
  name: "Icon",
},)

const props = defineProps<IconTypes>()

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("icon",)

const isLocal = computed(() => props.icon?.startsWith("svg-icon:",),)

const symbolId = computed(() => {
  return unref(isLocal,) ? `#icon-${props.icon?.split("svg-icon:",)[1]}` : props.icon
},)

const getIconifyStyle = computed(() => {
  const { color, size, } = props
  return {
    fontSize: `${size}px`,
    color,
  }
},)

const getIconName = computed(() => {
  return props.icon?.startsWith(ICON_PREFIX,) ? props.icon.replace(ICON_PREFIX, "",) : props.icon
},)
</script>

<template>
  <ElIcon :class="prefixCls" :color="color" :size="size">
    <svg v-if="isLocal" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <template v-else>
      <Icon v-if="props.icon" :icon="getIconName!" :style="getIconifyStyle" />
    </template>
  </ElIcon>
</template>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;
$prefix-cls: "#{$adminNamespace}-setting";

.#{$prefix-cls},
.iconify {
  :deep(svg) {
    &:hover {
      color: v-bind(hoverColor) !important;
    }
  }
}

.iconify {
  &:hover {
    color: v-bind(hoverColor) !important;
  }
}
</style>

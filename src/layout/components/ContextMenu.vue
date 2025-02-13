<script setup lang="ts">
import type { ElDropdown, } from "element-plus"
import type { PropType, } from "vue"
import type { RouteLocationNormalizedLoaded, } from "vue-router"
import type { ContextMenuSchema, } from "./helper.ts"
import { useDesign, } from "@/hooks/useDesign"

const props = defineProps({
  schema: {
    type: Array as PropType<ContextMenuSchema[]>,
    default: () => [],
  },
  trigger: {
    type: String as PropType<"click" | "hover" | "focus" | "contextmenu">,
    default: "contextmenu",
  },
  tagItem: {
    type: Object as PropType<RouteLocationNormalizedLoaded>,
    default: () => ({}),
  },
},)

const emit = defineEmits(["visibleChange",],)

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("context-menu",)

function command(item: ContextMenuSchema,) {
  item.command && item.command(item,)
}

function visibleChange(visible: boolean,) {
  emit("visibleChange", visible, props.tagItem,)
}

const elDropdownMenuRef = ref<ComponentRef<typeof ElDropdown>>()

defineExpose({
  elDropdownMenuRef,
  tagItem: props.tagItem,
},)
</script>

<template>
  <ElDropdown
    ref="elDropdownMenuRef"
    :class="prefixCls"
    :trigger="trigger"
    placement="bottom-start"
    popper-class="v-context-menu-popper"
    @command="command"
    @visible-change="visibleChange"
  >
    <slot />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="(item, index) in schema"
          :key="`dropdown${index}`"
          :command="item"
          :disabled="item.disabled"
          :divided="item.divided"
        >
          <Icon :icon="item.icon" /> {{ (item.label) }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

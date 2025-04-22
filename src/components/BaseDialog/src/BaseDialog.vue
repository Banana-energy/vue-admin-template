<script lang="ts" setup>
import type { DialogProps, ScrollbarInstance, } from "element-plus"
import type { Props, } from "./types.ts"
import { omit, } from "lodash-es"

defineOptions({
  name: "BaseDialog",
},)

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  fullscreen: true,
  width: "90vw",
  loading: false,
  closeOnClickModal: false,
  destroyOnClose: true,
  lockScroll: true,
  draggable: true,
  showClose: true,
  top: "5vh",
  modal: true,
  closeOnPressEscape: true,
},)

const isFullscreen = ref(false,)

function toggleFull() {
  isFullscreen.value = !unref(isFullscreen,)
}

const bindProps = computed<Partial<DialogProps>>(() => {
  const omitKeys = ["maxHeight", "loading",]
  const omitProps = omit(props, omitKeys,)
  return {
    ...omitProps,
    fullscreen: unref(isFullscreen,),
  }
},)

const bodyRef = ref<ScrollbarInstance>()
const footerRef = ref<HTMLDivElement>()

const offset = computed(() => {
  if (isFullscreen.value) {
    return 50
  }
  return innerHeight * 0.05 + 50
},)

const { maxHeight, } = useMaxHeight({
  targetRef: bodyRef as Ref<ComponentPublicInstance>,
  otherRefs: footerRef,
  offset,
},)

defineExpose({
  maxHeight,
  isFullscreen,
},)
</script>

<template>
  <ElDialog v-bind="bindProps">
    <template #header>
      <div class="flex justify-between">
        <slot name="title">
          {{ title }}
        </slot>
        <Icon
          v-if="fullscreen"
          :icon="isFullscreen ? 'zmdi:fullscreen-exit' : 'zmdi:fullscreen'"
          class="is-hover z-10 mr-[18px] mt-[2px] cursor-pointer"
          color="var(--el-color-info)"
          @click="toggleFull"
        />
      </div>
    </template>
    <ElScrollbar ref="bodyRef" v-loading="loading" :max-height="props.maxHeight || maxHeight">
      <slot />
    </ElScrollbar>
    <template v-if="$slots.footer" #footer>
      <slot name="footer-content" />
      <div ref="footerRef" class="flex justify-end">
        <slot name="footer" />
      </div>
    </template>
  </ElDialog>
</template>

<style lang="scss">
@use "@/styles/variables.module.scss" as *;

.#{$elNamespace}-dialog__header {
  margin-right: 0 !important;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid var(--tags-view-border-color);

  &btn {
    top: 5px;

    & .el-dialog__close {
      font-size: 18px;
    }
  }
}

.#{$elNamespace}-dialog__footer {
  border-top: 1px solid var(--tags-view-border-color);
}

.is-hover {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.dark {
  .#{$elNamespace}-dialog__header {
    border-bottom: 1px solid var(--el-border-color);
  }

  .#{$elNamespace}-dialog__footer {
    border-top: 1px solid var(--el-border-color);
  }
}
</style>

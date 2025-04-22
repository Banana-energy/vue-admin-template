<script setup lang="ts">
import type { TooltipInstance, } from "element-plus"
import type { Props, } from "./types.ts"
import { useFormSize, useNamespace, } from "element-plus"
import { isUndefined, } from "lodash-es"
import "element-plus/es/components/text/style/index"

defineOptions({
  name: "ElText",
},)

const props = withDefaults(defineProps<Props>(), {
  tag: "span",
  type: "",
  size: "",
  truncated: false,
},)

const textRef = ref<HTMLElement>()

const textSize = useFormSize()
const ns = useNamespace("text",)

const textKls = computed(() => [
  ns.b(),
  ns.m(props.type,),
  ns.m(textSize.value,),
  ns.is("truncated", props.truncated,),
  ns.is("line-clamp", !isUndefined(props.lineClamp,),),
],)

const attrs = useAttrs()

const content = ref("",)
const tooltipRef = ref<TooltipInstance>()
const tooltipVisible = ref(false,)

function bindTitle() {
  let shouldAddTitle = false
  content.value = textRef.value?.textContent || ""
  if (props.truncated) {
    const width = textRef.value?.offsetWidth
    const scrollWidth = textRef.value?.scrollWidth
    if (width && scrollWidth && scrollWidth > width) {
      shouldAddTitle = true
    }
  } else if (!isUndefined(props.lineClamp,)) {
    const height = textRef.value?.offsetHeight
    const scrollHeight = textRef.value?.scrollHeight
    if (height && scrollHeight && scrollHeight > height) {
      shouldAddTitle = true
    }
  }
  tooltipVisible.value = shouldAddTitle
}

onMounted(bindTitle,)
onUpdated(bindTitle,)
</script>

<template>
  <ElTooltip
    v-if="tooltipVisible"
    ref="tooltipRef"
    :content="content"
    :popper-options="{
      modifiers: [
        {
          name: 'computeStyles',
          options: {
            adaptive: false,
            enabled: false,
          },
        },
      ],
    }"
    :virtual-ref="textRef"
    popper-class="singleton-tooltip"
    virtual-triggering
  >
    <template #content>
      <slot name="content" />
    </template>
  </ElTooltip>
  <component
    :is="tag"
    ref="textRef"
    v-bind="{ ...attrs }"
    :class="textKls"
    :style="{ '-webkit-line-clamp': lineClamp }"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">

</style>

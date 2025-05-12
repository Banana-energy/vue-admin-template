<script lang="ts" setup>
import type { SelectInstance, } from "element-plus"
import type { ModelValue, OptionItem, Props, } from "./types.ts"
import { omit, } from "lodash-es"
import { defaultProps, } from "./types.ts"
import { useOptions, } from "./useOptions.ts"

defineOptions({
  name: "ApiSelect",
},)
const props = withDefaults(defineProps<Props>(), defaultProps,)

const emits = defineEmits<{
  change: [val: ModelValue,]
  paste: [e: ClipboardEvent, options: OptionItem[], val?: string,]
}>()

interface DynamicSlots {
  [key: string]: unknown
}

const modelValue = defineModel<ModelValue>({ required: true, },)

const attrs: Record<string, unknown> = useAttrs()
const slots = useSlots() as DynamicSlots

const { options, loading, formatOptions, fetchOptions, } = useOptions(props,)

const bindProps = computed(() => {
  const omitKeys = Object.keys(defaultProps,)
  const omitProps = omit(props, omitKeys,)
  const optionsComponents = ["ElCascader", "ElSelectV2",]
  return {
    [props.modelPropName]: unref(modelValue,),
    [`onUpdate:${props.modelPropName}`]: (value: ModelValue,) => {
      emits("change", value,)
      modelValue.value = value
    },
    ...attrs,
    ...omitProps,
    options: optionsComponents.includes(props.component.name || "",) ? unref(formatOptions,) : undefined,
    loading: unref(loading,),
  }
},)

const componentRef = ref<unknown>()

function handlePaste(e: ClipboardEvent,) {
  const { clipboardData, } = e
  if (clipboardData) {
    const text = clipboardData.getData("text",)
    emits("paste", e, unref(formatOptions,), text,)
  }
}

onMounted(() => {
  if (props.component.name === "ElSelect") {
    const selectInstance = componentRef.value as SelectInstance
    selectInstance.inputRef?.addEventListener("paste", handlePaste,)
  }
},)

onBeforeUnmount(() => {
  if (props.component.name === "ElSelect") {
    const selectInstance = componentRef.value as SelectInstance
    selectInstance.inputRef?.removeEventListener("paste", handlePaste,)
  }
},)

defineExpose({
  options,
  formatOptions,
  fetchOptions,
  componentRef,
},)
</script>

<template>
  <component :is="props.component" ref="componentRef" v-bind="bindProps">
    <template v-for="item in Object.keys(slots) " #[item]="data">
      <slot :name="item" v-bind="data || {}" />
    </template>
    <template v-if="props.childComponent">
      <component
        :is="props.childComponent"
        v-for="item in formatOptions"
        :key="item.value"
        :disabled="item.disabled"
        :label="item.label"
        :value="item.value"
      />
    </template>
    <template v-if="props.component.name === 'ElSelect'">
      <ElOption
        v-for="item in formatOptions"
        :key="item.value"
        :disabled="item.disabled"
        :label="item.label"
        :value="item.value!"
      />
    </template>
  </component>
</template>

<style lang="scss" scoped>

</style>

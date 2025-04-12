<script lang="ts" setup>
import type { ModelValue, Props, } from "./types.ts"
import { omit, } from "lodash-es"
import { defaultProps, } from "./types.ts"
import { useOptions, } from "./useOptions.ts"

defineOptions({
  name: "ApiSelect",
},)
const props = withDefaults(defineProps<Props>(), defaultProps,)

const emits = defineEmits<{
  change: [val: ModelValue,]
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

defineExpose({
  options,
  formatOptions,
  fetchOptions,
},)
</script>

<template>
  <component v-bind="bindProps" :is="props.component">
    <template v-for="item in Object.keys(slots) " #[item]="data">
      <slot v-bind="data || {}" :name="item" />
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
    <template v-if="component.name === 'ElSelect'">
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

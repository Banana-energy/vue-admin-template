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

const attrs = useAttrs()
const slots = useSlots() as DynamicSlots

const { options, loading, formatOptions, fetchOptions, } = useOptions(props,)

const bindProps = computed(() => {
  const omitKeys = Object.keys(defaultProps,)
  const omitProps = omit(props, omitKeys,)
  const optionsComponents = ["ElCascader",]
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
  <component :is="props.component" v-bind="bindProps">
    <template v-for="item in Object.keys(slots) " #[item]="data">
      <slot :name="item" v-bind="data || {}" />
    </template>
    <template v-if="component.name === 'ElCheckboxGroup'">
      <template v-if="props.checkboxButton">
        <ElCheckboxButton
          v-for="item in formatOptions"
          :key="item.value"
          :disabled="item.disabled"
          :label="item.label"
          :value="item.value"
        />
      </template>
      <template v-else>
        <ElCheckbox
          v-for="item in formatOptions"
          :key="item.value"
          :disabled="item.disabled"
          :label="item.label"
          :value="item.value"
        />
      </template>
    </template>
    <template v-if="component.name === 'ElRadioGroup'">
      <ElRadio
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

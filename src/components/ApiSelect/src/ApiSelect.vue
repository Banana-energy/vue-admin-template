<script lang="ts" setup>
import type { ModelValue, Props, } from "./types.ts"
import { useOptions, } from "./useOptions.ts"

defineOptions({
  name: "ApiSelect",
},)

const props = withDefaults(defineProps<Props>(), {
  modelPropName: "modelValue",
  component: () => ElSelect,
  params: () => ({}),
  immediate: true,
  beforeFetch: (params: unknown,) => params,
  afterFetch: (res: unknown,) => Array.isArray(res,) ? res : [res,],
  apiConfig: undefined,
  cacheData: true,
},)

const emits = defineEmits<{
  change: [val: ModelValue,]
}>()

const modelValue = defineModel<ModelValue>({ required: true, },)

const attrs = useAttrs()

const { options, loading, formatOptions, fetchOptions, } = useOptions(props,)

const bindProps = computed(() => {
  return {
    [props.modelPropName]: unref(modelValue,),
    [`onUpdate:${props.modelPropName}`]: (value: ModelValue,) => {
      emits("change", value,)
      modelValue.value = value
    },
    ...attrs,
    options: unref(formatOptions,),
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
    <template v-for="item in Object.keys($slots)" #[item]="data">
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

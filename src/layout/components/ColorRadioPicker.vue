<script setup lang="ts">
import { useDesign, } from "@/hooks/useDesign"

const props = withDefaults(defineProps<{
  schema: string[]
  modelValue?: string
}>(), {
  schema: () => [],
  modelValue: "",
},)

const emit = defineEmits(["update:modelValue", "change",],)

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("color-radio-picker",)

const colorVal = ref(props.modelValue,)

watch(
  () => props.modelValue,
  (val,) => {
    if (val === unref(colorVal,)) {
      return
    }
    colorVal.value = val
  },
)

// 监听
watch(
  () => colorVal.value,
  (val,) => {
    emit("update:modelValue", val,)
    emit("change", val,)
  },
)
</script>

<template>
  <div :class="prefixCls" class="flex flex-wrap space-x-14px">
    <span
      v-for="(item, i) in schema"
      :key="`radio-${i}`"
      :class="{ 'is-active': colorVal === item }"
      :style="{
        background: item,
      }"
      class="mb-5px h-20px w-20px cursor-pointer border-2px border-gray-300 rounded-2px border-solid text-center leading-20px"
      @click="colorVal = item"
    >
      <Icon
        v-if="colorVal === item"
        :size="16"
        color="#fff"
        icon="vi-ep:check"
      />
    </span>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-color-radio-picker"; // 动态组合字符串

.#{$prefix-cls} {
  .is-active {
    border-color: var(--el-color-primary);
  }
}
</style>

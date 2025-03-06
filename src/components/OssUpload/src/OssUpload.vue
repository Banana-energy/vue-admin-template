<script lang="ts" setup>
import type { Props, } from "@/components/BaseUpload"
import { defaultProps, } from "@/components/BaseUpload"
import { omit, } from "lodash-es"
import { httpRequest, } from "./helper.ts"

defineOptions({
  name: "OssUpload",
},)

const props = withDefaults(defineProps<Props>(), defaultProps,)

const emits = defineEmits<{
  (event: "update:modelValue", value: BaseFileDTO[]): void
}>()
const attrs: Record<string, unknown> = useAttrs()

const bindProps = computed<Props>(() => {
  const omitKeys: (keyof Props)[] = ["httpRequest", "modelValue",]
  return {
    ...omit(props, omitKeys,),
    ...attrs,
    httpRequest,
  }
},)
</script>

<template>
  <BaseUpload
    :model-value="modelValue"
    v-bind="bindProps"
    @update:model-value="(val: BaseFileDTO[]) => emits('update:modelValue', val)"
  >
    <template v-for="(_, name) in $slots" #[name]="data">
      <slot :name="name" v-bind="data" />
    </template>
  </BaseUpload>
</template>

<style lang="scss" scoped>

</style>

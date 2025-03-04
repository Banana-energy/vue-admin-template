<script lang="ts" setup>
import type { Props as DescriptionsProps, } from "@/components/Descriptions"
import type { FormInstance, FormProps, } from "element-plus"
import type { Slots, } from "vue"
import to from "await-to-js"
import { omit, pick, } from "lodash-es"

defineOptions({
  name: "LayoutForm",
},)

const props = withDefaults(defineProps<Props>(), {
  span: 6,
},)

const emits = defineEmits<{
  (e: "search"): void
  (e: "reset"): void
}>()

const attrs: Record<string, unknown> = useAttrs()

type Props = Partial<FormProps> & DescriptionsProps & {
  /**
   * 是否是查询表单
   */
  queryForm?: boolean
  /**
   * loading
   */
  loading?: boolean
  /**
   * span
   */
  span?: number
}

const formRef = ref<FormInstance>()

const { default: defaultSlot, } = useSlots() as Slots

const formProps = computed(() => {
  const { labelPosition, labelWidth, } = props
  const omitKeys: (keyof DescriptionsProps)[] = ["descriptions", "title", "message", "collapse", "border", "labelSuffix", "descriptions", "data",]
  const omitProps = omit(props, omitKeys,)
  return {
    ...attrs,
    ...omitProps,
    labelPosition: labelPosition || "top",
    labelWidth: labelWidth || "auto",
  }
},)

const descriptionsProps = computed(() => {
  const pickKeys: (keyof DescriptionsProps)[] = ["descriptions", "title", "message", "collapse", "border", "labelSuffix", "descriptions", "data",]
  return pick(props, pickKeys,)
},)

const collapse = ref(true,)
const totalSpan = computed(() => {
  const slots = (defaultSlot?.() || []).filter(vnode => vnode.props,)
  return slots.reduce((sum, vnode,) => {
    return sum + (vnode.props?.span || props.span)
  }, props.span,)
},)
const isCollapseNeeded = computed(() => totalSpan.value > 24,)

const btnOffset = computed(() => {
  if (totalSpan.value - props.span === 24 && collapse.value) {
    return 0
  }
  const rowCount = Math.ceil(totalSpan.value / 24,)

  return rowCount * 24 - totalSpan.value
},)

const visibleFields = computed(() => {
  const slots = (defaultSlot?.() || []).filter(vnode => vnode.props,)
  if (!isCollapseNeeded.value || !collapse.value)
    return slots
  let sum = 0
  return slots.filter((vnode,) => {
    const span = vnode.props?.span || props.span
    sum += span
    return sum + props.span <= 24
  },)
},)

async function validate() {
  if (!formRef.value) {
    return false
  }
  const [error, result,] = await to(formRef.value?.validate(),)
  if (error === null && result) {
    return result
  }
  return false
}

defineExpose({
  formRef,
  validate,
},)
</script>

<template>
  <ElForm v-if="!props.disabled" ref="formRef" v-bind="formProps">
    <ElRow :gutter="20">
      <TransitionGroup name="fade">
        <ElCol v-for="(vnode, index) in visibleFields" :key="index" :span="vnode.props?.span || props.span">
          <slot :name="`field-${index}`">
            <component :is="vnode" />
          </slot>
        </ElCol>
      </TransitionGroup>
      <ElCol :offset="btnOffset" :span="props.span">
        <ElFormItem label=" ">
          <ElButton :loading="loading" @click="emits('reset')">
            <Icon class="mr-0.5" icon="ep:refresh-right" />
            重置
          </ElButton>
          <ElButton :loading="loading" type="primary" @click="emits('search')">
            <Icon class="mr-0.5" icon="ep:search" />
            搜索
          </ElButton>
          <ElButton
            v-if="isCollapseNeeded"
            type="primary"
            link
            @click="collapse = !collapse"
          >
            {{ collapse ? "展开" : "收起" }}
            <Icon
              :class="collapse ? '' : 'rotate-180'"
              class="transform transition duration-300"
              icon="ep:arrow-down"
            />
          </ElButton>
        </ElFormItem>
      </ElCol>
    </ElRow>
  </ElForm>
  <Descriptions v-else v-bind="descriptionsProps" />
</template>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}

:deep(.el-form-item--label-top .el-form-item__label) {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
}
</style>

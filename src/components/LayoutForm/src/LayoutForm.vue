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
  showMessage: true,
  scrollToError: true,
  validateOnRuleChange: true,
  scrollIntoViewOptions: () => ({
    behavior: "smooth",
    block: "center",
    inline: "center",
  }),
},)

const emits = defineEmits<{
  (e: "search"): void
  (e: "reset"): void
}>()

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

const attrs: Record<string, unknown> = useAttrs()

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

const collapse = ref(false,)

// 包括按钮组在内的所有span
const totalSpan = computed(() => {
  const slots = (defaultSlot?.() || []).filter(vnode => vnode.props,)
  return slots.reduce((sum, vnode,) => {
    return sum + (vnode.props?.span || props.span)
  }, props.span,)
},)
const isCollapseNeeded = computed(() => totalSpan.value > 24,)

const btnOffset = computed(() => {
  const _totalSpan = totalSpan.value
  if ((_totalSpan - props.span) % 24 === 0 || collapse.value) {
    return 0
  }
  const rowCount = Math.ceil(_totalSpan / 24,)

  return rowCount * 24 - _totalSpan
},)

const visibleFields = computed(() => {
  const slots = (defaultSlot?.() || []).filter(vnode => vnode.props,)
  // 如果不需要折叠或已展开，则显示所有字段
  if (!isCollapseNeeded.value || !collapse.value || !props.queryForm) {
    return slots
  }
  // 计算第一行可显示的字段
  const firstRowFields = []
  let sum = 0

  for (const vnode of slots) {
    const span = vnode.props?.span || props.span
    // 如果加上当前字段后超出一行，则停止添加
    if (sum + span > 24 - props.span) {
      break
    }
    firstRowFields.push(vnode,)
    sum += span
  }

  return firstRowFields
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

function setCollapse(val: boolean,) {
  collapse.value = val
}

defineExpose({
  formRef,
  validate,
  setCollapse,
},)
</script>

<template>
  <ElForm
    v-if="!props.disabled"
    ref="formRef"
    v-bind="formProps"
  >
    <ElRow :gutter="20">
      <TransitionGroup name="fade">
        <ElCol v-for="(vnode, index) in visibleFields" :key="index" :span="vnode.props?.span || props.span">
          <slot :name="`field-${index}`">
            <component :is="vnode" />
          </slot>
        </ElCol>
      </TransitionGroup>
      <ElCol
        v-if="queryForm"
        :offset="btnOffset"
        :span="props.span"
      >
        <ElFormItem class="query-button" label="button">
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

<style lang="scss" scoped>
.query-button {
  :deep(.el-form-item__label) {
    visibility: hidden;
  }
}

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
  z-index: -1;
}

:deep(.el-form-item--label-top .el-form-item__label) {
  line-height: var(--line-height-base);

  .el-select__wrapper {
    border: none;
    box-shadow: none;
    background: transparent;
    height: auto;
    padding: 0;
    min-height: auto;

    .el-select__input {
      height: auto;
    }
  }
}

:deep(.el-form-item__label) {
  font-size: var(--font-size-base);
}
</style>

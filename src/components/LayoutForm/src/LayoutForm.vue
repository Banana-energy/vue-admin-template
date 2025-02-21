<script lang="ts" setup>
import type { DescriptionItem, } from "@/components/Descriptions"
import type { FormInstance, FormProps, } from "element-plus"
import type { Slots, } from "vue"
import to from "await-to-js"
import { ElCollapseTransition, } from "element-plus"
import { omit, } from "lodash-es"

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

const attrs = useAttrs()

interface Props extends Partial<FormProps> {
  /**
   * 详情配置
   */
  descriptions?: DescriptionItem[]
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

const bindProps = computed(() => {
  const { labelPosition, labelWidth, } = props
  const omitKeys: (keyof Props)[] = ["descriptions",]
  const omitProps = omit(props, omitKeys,)
  return {
    ...attrs,
    ...omitProps,
    labelPosition: labelPosition || "top",
    labelWidth: labelWidth || "auto",
  }
},)

const collapse = ref(true,)

const renderSlotConfig = computed(() => {
  const slotContent: {
    default: VNode[]
    expand: VNode[]
    totalSpan: number
  } = { default: [], expand: [], totalSpan: 0, }
  if (defaultSlot) {
    const EXPAND_SPAN = 24
    const isQueryForm = props.queryForm
    defaultSlot().forEach((vnode: VNode,) => {
      if (!vnode.props) {
        // 注释节点
        return
      }
      const { span = props.span, } = vnode.props
      slotContent.totalSpan += span
      if (isQueryForm && slotContent.totalSpan > EXPAND_SPAN) {
        slotContent.expand.push(vnode,)
      } else {
        slotContent.default.push(vnode,)
      }
    },)
  }
  return slotContent
},)

const btnOffset = computed(() => {
  const { totalSpan, } = unref(renderSlotConfig,)
  const { span, } = props
  return totalSpan < 24
    ? (24 - totalSpan) - span
    : (24 / span - 1) * span
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
  <ElForm v-if="!props.disabled" ref="formRef" v-bind="bindProps">
    <ElRow :gutter="20">
      <template v-for="(vnode, index) in renderSlotConfig.default" :key="index">
        <ElCol :span="vnode.props?.span || props.span">
          <component :is="vnode" />
        </ElCol>
      </template>
      <ElCollapseTransition v-if="renderSlotConfig.expand.length">
        <ElCol v-show="!collapse" :span="24">
          <ElRow :gutter="20">
            <template v-for="(vnode, index) in renderSlotConfig.expand" :key="index">
              <ElCol :span="vnode.props?.span || props.span">
                <component :is="vnode" />
              </ElCol>
            </template>
          </ElRow>
        </ElCol>
      </ElCollapseTransition>
      <template v-if="queryForm">
        <ElCol :offset="btnOffset" :span="props.span">
          <ElFormItem>
            <ElButton :loading="loading" @click="emits('reset')">
              <Icon class="mr-0.5" icon="ep:refresh-right" />
              重置
            </ElButton>
            <ElButton :loading="loading" type="primary" @click="emits('search')">
              <Icon class="mr-0.5" icon="ep:search" />
              搜索
            </ElButton>
            <ElButton
              v-if="renderSlotConfig.expand.length"
              type="primary"
              link
              @click="collapse = !collapse"
            >
              {{ collapse ? '展开' : '收起' }}
              <Icon
                :class="collapse ? '' : 'rotate-180'"
                class="transform transition duration-300"
                icon="ant-design:down-outlined"
              />
            </ElButton>
          </ElFormItem>
        </ElCol>
      </template>
    </ElRow>
  </ElForm>
  <Descriptions v-if="props.disabled" :descriptions="descriptions" />
</template>

<style scoped>

</style>

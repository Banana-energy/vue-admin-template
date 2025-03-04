<script lang="ts" setup>
import type { AllowedComponentProps, } from "vue"
import type { DescriptionItem, Props, } from "./types.ts"
import { useAppStore, } from "@/store/App"
import { ElCollapseTransition, } from "element-plus"
import { omit, } from "lodash-es"
import { defaultProps, } from "./types.ts"

defineOptions({
  name: "Descriptions",
},)

const props = withDefaults(defineProps<Props>(), defaultProps,)

const appStore = useAppStore()

const mobile = computed(() => appStore.getMobile,)

const attrs: Record<string, unknown> = useAttrs()

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("descriptions",)

const bindProps = computed(() => {
  const omitKeys: (keyof Props | keyof AllowedComponentProps)[] = ["title", "message", "collapse", "descriptions", "data", "class",]
  return omit({ ...props, ...attrs, }, omitKeys,)
},)

function getBindItemProps(item: DescriptionItem,) {
  const omitKeys: (keyof DescriptionItem)[] = ["field",]
  return omit(item, omitKeys,)
}

// 折叠
const show = ref(true,)

function toggleClick() {
  if (props.collapse) {
    show.value = !unref(show,)
  }
}
</script>

<template>
  <div
    :class="[prefixCls]"
    class="bg-[var(--el-color-white)] dark:border-1px dark:border-[var(--el-border-color)] dark:bg-[var(--el-bg-color)]"
  >
    <div
      v-if="props.title"
      :class="[
        `${prefixCls}-header`,
      ]"
      class="relative flex cursor-pointer items-center justify-between p-3 pt-6"
      @click="toggleClick"
    >
      <div :class="[`${prefixCls}-header__title`]" class="relative font-bold">
        <div class="flex items-center font-size-xl">
          {{ props.title }}
          <ElTooltip v-if="props.message" :content="props.message" placement="right">
            <Icon class="ml-1" icon="ep:warning" />
          </ElTooltip>
        </div>
      </div>
      <Icon v-if="collapse" :icon="show ? 'ep:arrow-down' : 'ep:arrow-up'" />
    </div>

    <ElCollapseTransition>
      <div v-show="show" :class="[`${prefixCls}-content`]" class="p-3">
        <ElDescriptions
          :border="props.border"
          :column="2"
          :direction="mobile ? 'vertical' : 'horizontal'"
          v-bind="bindProps"
        >
          <ElDescriptionsItem
            v-for="item in props.descriptions"
            :key="item.field"
            :span="item.span || 1"
            class-name="color-[var(--regular-text-color)]"
            label-class-name="!color-[var(--regular-text-color)]"
            v-bind="getBindItemProps(item)"
          >
            <template #label>
              <slot :label="item.label" :name="`${item.field}-label`" :row="data">
                <div class="whitespace-nowrap font-size-base">
                  {{ item.label + props.labelSuffix }}
                </div>
              </slot>
            </template>

            <template #default>
              <slot :name="item.field" :row="data">
                <div class="max-w-[500px] min-w-[200px] font-size-base">
                  <ElScrollbar>
                    {{
                      Array.isArray(data[item.field])
                        ? data[item.field].join(',')
                        : data[item.field]
                    }}
                  </ElScrollbar>
                </div>
              </slot>
            </template>
          </ElDescriptionsItem>
        </ElDescriptions>
      </div>
    </ElCollapseTransition>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-descriptions";

.#{$prefix-cls}-content {
  :deep(.#{$elNamespace}-descriptions__cell) {
    width: 0;
  }
}
</style>

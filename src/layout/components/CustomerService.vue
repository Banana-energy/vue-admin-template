<script lang="ts" setup>
import { useDesign, } from "@/hooks/useDesign"
import { useLocaleConfig, } from "@/hooks/useLocaleConfig"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("customer-service",)

const el = ref<HTMLElement>()

const { width, height, } = useWindowSize()

const { textLength, } = useLocaleConfig([
  {
    textLength: 50,
  },
  {
    textLength: 140,
  },
],)

const position = computed(() => {
  return {
    left: width.value - 12 - textLength,
    top: height.value - 100 - 50,
  }
},)

watch(
  () => position.value,
  (value,) => {
    if (el.value) {
      const { left, top, } = value
      el.value.style.left = `${left}px`
      el.value.style.top = `${top}px`
    }
  },
)

let now: number
const { style, } = useDraggable(el, {
  initialValue: { x: position.value.left, y: position.value.top, },
  preventDefault: true,
  onStart: () => {
    now = Date.now()
  },
  onEnd: () => {
    if (Date.now() - now < 180) {
      // 拖拽事件不超过180ms判断为点击
      window.open("https://applink.feishu.cn/T8RVo3BX2EaT ", "_blank",)
    }
  },
},)
</script>

<template>
  <div ref="el" :class="prefixCls" :style="style">
    <Icon :size="30" color="var(--primary-color)" icon="ri:customer-service-2-fill" />
    <div class="text">
      在线客服
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-customer-service";

.#{$prefix-cls} {
  position: fixed;
  right: 12px;
  bottom: 100px;
  z-index: 99999;
  display: flex;
  width: max-content;
  height: max-content;
  cursor: pointer;
  border-radius: 50% 50%;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > .logo {
    width: 50px;
    height: 50px;
  }

  > .text {
    font-size: 12px;
    font-weight: 700;
    line-height: 28px;
    color: var(--primary-color);
    white-space: nowrap;
  }
}
</style>

import type { ComponentPublicInstance, } from "vue"
import { debounce, } from "lodash-es"

type ElementRef = Ref<HTMLElement | ComponentPublicInstance | undefined>
interface UseMaxHeightOptions {
  targetRef: ElementRef
  otherRefs?: ElementRef[] | ElementRef
  minHeight?: number
  offset?: number
}

export function useMaxHeight({
  targetRef,
  otherRefs,
  minHeight = 500,
  offset = 50,
}: UseMaxHeightOptions,) {
  const maxHeight = ref(minHeight,)

  const getElementRect = (el?: HTMLElement | ComponentPublicInstance,): DOMRect => {
    const domRect = {
      height: 0,
      width: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }
    if (!el) {
      return domRect
    }
    // 如果是 Vue 组件，获取其 $el
    const dom = (el as ComponentPublicInstance).$el || el
    // 确保是 HTMLElement 后获取高度
    if (dom instanceof HTMLElement) {
      return dom.getBoundingClientRect()
    }
    return domRect
  }

  const otherEls = computed(() => {
    if (!otherRefs) {
      return []
    }
    const refs = Array.isArray(otherRefs,) ? otherRefs : [otherRefs,]
    return refs.map(ref => ref.value,)
  },)

  const calculateMaxHeight = debounce(() => {
    if (!targetRef.value) {
      return
    }

    // 获取视口高度
    const viewportHeight = window.innerHeight

    // 获取目标元素距离顶部的距离
    const targetOffsetTop = getElementRect(targetRef.value,).top || 0

    // 计算其他元素的总高度
    const otherHeight = otherEls.value.reduce((total, ref,) => {
      total += getElementRect(ref,).height
      return total
    }, 0,)

    // 计算剩余空间
    const availableHeight = viewportHeight - targetOffsetTop - otherHeight - offset

    // 当前元素的最大高度 = 剩余空间 或 最小高度（二者取较大值）
    maxHeight.value = Math.max(availableHeight, minHeight,)
  }, 200,)

  // 初始化和窗口大小变化时重新计算
  onMounted(() => {
    window.addEventListener("resize", calculateMaxHeight,)
  },)

  // 清理事件监听器
  onBeforeUnmount(() => {
    window.removeEventListener("resize", calculateMaxHeight,)
  },)

  watch(() => [targetRef.value, otherEls.value,], calculateMaxHeight,)

  return {
    maxHeight,
  }
}

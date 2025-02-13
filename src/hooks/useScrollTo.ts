import { useScroll, useThrottleFn, } from "@vueuse/core"

export interface ScrollToParams {
  el: HTMLElement
  to: number
  position: string
  duration?: number
  callback?: () => void
}
export function useScrollTo({
  el,
  position = "scrollTop",
  to,
  duration = 500,
  callback,
}: ScrollToParams,) {
  const { x, y, } = useScroll(el,)

  function start() {
    const startPosition = position === "scrollTop" ? y.value : x.value
    const delta = to - startPosition

    const step = useThrottleFn(() => {
      const elapsed = Math.min(1, performance.now() / duration,)
      const value = startPosition + delta * elapsed

      if (position === "scrollTop") {
        y.value = value
      } else {
        x.value = value
      }

      if (elapsed < 1) {
        requestAnimationFrame(step,)
      } else {
        stop()
        if (callback) {
          callback()
        }
      }
    }, 20,)

    requestAnimationFrame(step,)
  }

  return { start, }
}

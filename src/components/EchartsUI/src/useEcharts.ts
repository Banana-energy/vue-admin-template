import type { EChartsOption, } from "echarts"
import type EchartsUI from "./EchartsUI.vue"

import echarts from "./echarts"

type EchartsUIInstance = InstanceType<typeof EchartsUI>

type EchartsThemeType = "dark" | "light" | null

function useEcharts() {
  const chartRef = ref<EchartsUIInstance>()
  const chartInstance = shallowRef<echarts.ECharts>()

  const { height, width, } = useWindowSize()
  const resizeHandler: () => void = useDebounceFn(resize, 200,)

  const initCharts = (theme?: EchartsThemeType,) => {
    const el = chartRef?.value?.$el
    if (!el) {
      return
    }
    chartInstance.value = echarts.init(el, theme,)

    return chartInstance.value
  }

  const renderEcharts = (
    options: EChartsOption,
    clear = true,
  ): Promise<echarts.ECharts | undefined> => {
    const currentOptions = {
      ...options,
    }
    return new Promise((resolve,) => {
      const el = chartRef?.value?.$el
      if (el?.offsetHeight === 0) {
        useTimeoutFn(async() => {
          resolve(await renderEcharts(currentOptions,),)
        }, 30,)
        return
      }
      nextTick(() => {
        useTimeoutFn(() => {
          if (!chartInstance.value) {
            const instance = initCharts()
            if (!instance)
              return
          }
          clear && chartInstance.value?.clear()
          chartInstance.value?.setOption(currentOptions,)
          resolve(chartInstance.value,)
        }, 30,)
      },)
    },)
  }

  function resize() {
    chartInstance.value?.resize({
      animation: {
        duration: 300,
        easing: "quadraticIn",
      },
    },)
  }

  watch([width, height,], () => {
    resizeHandler?.()
  },)

  useResizeObserver(chartRef, resizeHandler,)

  tryOnUnmounted(() => {
    // 销毁实例，释放资源
    chartInstance.value?.dispose()
  },)
  return {
    chartRef,
    renderEcharts,
    resize,
    chartInstance,
  }
}

export { useEcharts, }

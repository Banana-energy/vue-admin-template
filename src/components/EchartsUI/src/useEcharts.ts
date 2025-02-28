import type { EChartsOption, } from "echarts"
import type EchartsUI from "./EchartsUI.vue"
import echarts from "./echarts"

type EchartsUIInstance = InstanceType<typeof EchartsUI>
type EchartsThemeType = "dark" | "light" | null

interface EchartsOptions {
  theme?: EchartsThemeType
  autoResize?: boolean
  resizeDebounceWait?: number
  renderTimeout?: number
}

const defaultOptions: EchartsOptions = {
  theme: null,
  autoResize: true,
  resizeDebounceWait: 200,
  renderTimeout: 30,
}

export function useEcharts(options: EchartsOptions = {},) {
  const mergedOptions = { ...defaultOptions, ...options, }

  const chartRef = ref<EchartsUIInstance>()
  const chartInstance = shallowRef<echarts.ECharts>()
  const loading = ref(false,)

  const { height, width, } = useWindowSize()

  const initCharts = (theme: EchartsThemeType = mergedOptions.theme ?? null,) => {
    try {
      const el = chartRef?.value?.$el
      if (!el) {
        throw new Error("图表容器未找到",)
      }

      // 销毁旧实例
      if (chartInstance.value) {
        chartInstance.value.dispose()
      }

      chartInstance.value = echarts.init(el, theme,)
      return chartInstance.value
    } catch (error) {
      console.error("初始化图表失败:", error,)
      return undefined
    }
  }

  const setLoading = (status: boolean,) => {
    loading.value = status
    if (chartInstance.value) {
      status ? chartInstance.value.showLoading() : chartInstance.value.hideLoading()
    }
  }

  const renderEcharts = async(
    options: EChartsOption,
    clear = true,
  ): Promise<echarts.ECharts | undefined> => {
    try {
      setLoading(true,)
      const currentOptions = { ...options, }

      const el = chartRef?.value?.$el
      if (!el) {
        throw new Error("图表容器未找到",)
      }

      // 处理容器高度为0的情况
      if (el.offsetHeight === 0) {
        await new Promise((resolve,) => {
          useTimeoutFn(() => resolve(true,), mergedOptions.renderTimeout ?? 30,)
        },)
        return renderEcharts(currentOptions,)
      }

      await nextTick()

      // 确保实例存在
      if (!chartInstance.value) {
        const instance = initCharts()
        if (!instance) {
          throw new Error("图表实例创建失败",)
        }
      }

      if (clear) {
        chartInstance.value?.clear()
      }

      chartInstance.value?.setOption(currentOptions,)
      return chartInstance.value
    } catch (error) {
      console.error("渲染图表失败:", error,)
      return undefined
    } finally {
      setLoading(false,)
    }
  }

  const resize = useDebounceFn(
    () => {
      try {
        chartInstance.value?.resize({
          animation: {
            duration: 300,
            easing: "quadraticIn",
          },
        },)
      } catch (error) {
        console.error("图表重置大小失败:", error,)
      }
    },
    mergedOptions.resizeDebounceWait,
  )

  // 切换主题
  const updateTheme = (theme: EchartsThemeType,) => {
    try {
      const options = chartInstance.value?.getOption()
      initCharts(theme,)
      if (options) {
        chartInstance.value?.setOption(options,)
      }
    } catch (error) {
      console.error("切换主题失败:", error,)
    }
  }

  if (mergedOptions.autoResize) {
    watch([width, height,], resize,)
    useResizeObserver(chartRef, resize,)
  }

  tryOnUnmounted(() => {
    chartInstance.value?.dispose()
  },)

  return {
    chartRef,
    chartInstance,
    renderEcharts,
    resize,
    updateTheme,
    setLoading,
  }
}

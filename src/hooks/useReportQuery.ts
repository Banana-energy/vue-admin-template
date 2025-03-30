import type { LayoutFormInstance, } from "@/components/LayoutForm"
import type { PaginationInstance, } from "@/components/Pagination"
import type { FormInstance, } from "element-plus"
import type { Reactive, } from "vue"
import type { VxeTableInstance, VxeToolbarInstance, } from "vxe-table"
import { cloneDeep, isEqual, } from "lodash-es"
import { useRequest, } from "vue-hooks-plus"

interface DateTransform<T,> {
  source: string
  startField: keyof T
  endField: keyof T
}

interface Options<TData, TParams,> {
  api: (params: TParams) => Promise<ResponseData<TData[]> | PageResponseData<TData> | NewPageResponseData<TData> | NewResponseData<TData[]> | undefined>
  formData?: Omit<TParams, "current" | "size">
  autoRequest?: boolean
  hasPager?: boolean
  customToolbar?: boolean
  offsetHeight?: number | Ref<number>
  defaultPageSize?: number
  dateTransform?: DateTransform<TParams>[]
  resetWithSearch?: boolean
}

interface Return<TData, TParams,> {
  loading: Ref<boolean>
  formRef: Ref<FormInstance | LayoutFormInstance | undefined>
  tableRef: Ref<VxeTableInstance<TData> | undefined>
  toolbarRef: Ref<VxeToolbarInstance | undefined>
  pager: Reactive<BasicPage>
  pagerRef: Ref<PaginationInstance | undefined>
  queryParams: ComputedRef<TParams>
  tableData: Ref<TData[]>
  handleSearch: () => Promise<void>
  handleReset: () => Promise<void>
  handlePagerChange: (val: BasicPage,) => void
  maxHeight: Ref<number>
  cancel: () => void
}

interface Params extends Partial<PageParams> {
  [key: string]: any
}

export function useReportQuery<TData, TParams extends Params,>(options: Options<TData, TParams>,): Return<TData, TParams> {
  const {
    api,
    formData,
    hasPager = true,
    autoRequest = true,
    // APP padding  20 + ElCard padding 16 + border 1
    offsetHeight = 20 + 16 + 1,
    customToolbar = false,
    dateTransform = [],
    resetWithSearch = false,
    defaultPageSize = 20,
  } = options

  const tableRef = ref<VxeTableInstance<TData>>()
  const toolbarRef = ref<VxeToolbarInstance>()
  const tableData = ref<TData[]>([],) as Ref<TData[]>
  const formRef = ref<FormInstance | LayoutFormInstance>()
  const pager = reactive<BasicPage>({
    current: 1,
    size: defaultPageSize,
    total: 0,
  },)
  const pagerRef = ref<PaginationInstance>()

  const { maxHeight, } = useMaxHeight({
    targetRef: tableRef,
    otherRefs: hasPager ? pagerRef as Ref<ComponentPublicInstance> : undefined,
    offset: offsetHeight,
  },)

  let lastQueryData = cloneDeep(formData,)
  const originalFormData = cloneDeep(formData,)

  const transformParams = (params: TParams,): TParams => {
    const clonedParams = cloneDeep(params,)

    // 处理日期范围转换
    dateTransform.forEach(({ source, startField, endField, },) => {
      if (source in clonedParams) {
        const dateRange = clonedParams[source]
        if (Array.isArray(dateRange,)) {
          const [startDate, endDate,] = dateRange
          clonedParams[startField] = startDate
          clonedParams[endField] = endDate
          delete clonedParams[source]
        }
      }
    },)

    return clonedParams
  }
  const queryParams = computed<TParams>(() => {
    const { current, size, } = pager
    const params = hasPager
      ? { ...formData, current, size, }
      : { ...formData, }

    return transformParams(params as TParams,)
  },)

  const { loading, run, cancel, } = useRequest(api, {
    manual: true,
    loadingDelay: 300,
    onSuccess(result,) {
      if (result) {
        if ("data" in result && result.data) {
          if ("list" in result.data) {
            tableData.value = result.data.list || []
            pager.total = result.data.totalCount
          }
        }
        if ("datas" in result && result?.datas) {
          if ("records" in result.datas) {
            tableData.value = result.datas.records || []
            pager.total = result.datas.pager.total
            return
          }
          tableData.value = result.datas
        }
        return
      }
      tableData.value = []
    },
    onFinally() {
      lastQueryData = cloneDeep(formData,)
    },
  },)

  async function handleSearch() {
    const valid = await formRef.value?.validate()
    if (valid || !formRef.value) {
      if (!isEqual(lastQueryData, formData,)) {
        pager.current = 1
      }
      run(queryParams.value,)
    }
  }

  function handlePagerChange(val: BasicPage,) {
    Object.assign(pager, val,)
    handleSearch()
  }

  if (autoRequest) {
    onMounted(handleSearch,)
    onActivated(handleSearch,)
  }

  if (customToolbar) {
    onMounted(() => {
      const _tableRef = tableRef.value
      const _toolbarRef = toolbarRef.value
      if (_tableRef && _toolbarRef) {
        _tableRef.connect(_toolbarRef,)
      }
    },)
  }

  async function handleReset() {
    if (formRef.value) {
      if ("formRef" in formRef.value) {
        formRef.value.formRef?.resetFields()
      } else {
        formRef.value.resetFields()
      }
    }
    if (formData && originalFormData) {
      // 重置表单数据
      Object.keys(formData,).forEach((key,) => {
        formData[key as keyof typeof formData] = originalFormData[key as keyof typeof originalFormData]
      },)
    }
    if (resetWithSearch) {
      await handleSearch()
    }
  }

  return {
    tableData,
    tableRef,
    toolbarRef,
    formRef,
    loading,
    pager,
    pagerRef,
    maxHeight,
    queryParams,
    cancel,
    handleReset,
    handleSearch,
    handlePagerChange,
  }
}

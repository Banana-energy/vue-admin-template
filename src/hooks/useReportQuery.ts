import type { LayoutFormInstance, } from "@/components/LayoutForm"
import type { PaginationInstance, } from "@/components/Pagination"
import type { FormInstance, } from "element-plus"
import type { Reactive, } from "vue"
import type { VxeTableInstance, VxeToolbarInstance, } from "vxe-table"
import { cloneDeep, isEqual, isFunction, omit, } from "lodash-es"
import { useRequest, } from "vue-hooks-plus"

interface DateTransform<TParams,> {
  source: Exclude<string, keyof TParams>
  startField: keyof TParams
  endField: keyof TParams
}

type Response<T,> = ResponseData<T[]> | PageResponseData<T> | NewPageResponseData<T> | NewResponseData<T[]>

interface Options<TData, TParams extends Params, TFormData extends Omit<TParams, keyof PageParams>, > {
  api: (params: TParams) => Promise<Response<TData> | undefined>
  formData?: TFormData
  autoRequest?: boolean
  hasPager?: boolean
  customToolbar?: boolean
  formatParams?: (formData?: TFormData) => TFormData
  offsetHeight?: number | Ref<number>
  defaultPageSize?: number
  dateTransform?: DateTransform<TParams>[]
  afterFetch?: (data: Response<TData>,) => void
  resetWithSearch?: boolean
}

interface Return<TData, TParams, TFormData,> {
  loading: Ref<boolean>
  formRef: Ref<FormInstance | LayoutFormInstance | undefined>
  tableRef: Ref<VxeTableInstance<TData> | undefined>
  toolbarRef: Ref<VxeToolbarInstance | undefined>
  pager: Reactive<NewBasicPage>
  pagerRef: Ref<PaginationInstance | undefined>
  queryParams: ComputedRef<TParams>
  lastQueryData: Ref<TFormData | undefined>
  tableData: Ref<TData[]>
  handleSearch: () => Promise<void>
  handleReset: () => Promise<void>
  handlePagerChange: (val: NewBasicPage,) => void
  maxHeight: Ref<number>
  cancel: () => void
}

interface Params extends Partial<PageParams> {
  [key: string]: any
}

export function useReportQuery<TData, TParams extends Params, TFormData extends Omit<TParams, keyof PageParams>,>(options: Options<TData, TParams, TFormData>,): Return<TData, TParams, TFormData> {
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
    formatParams,
    afterFetch,
  } = options

  const tableRef = ref<VxeTableInstance<TData>>()
  const toolbarRef = ref<VxeToolbarInstance>()
  const tableData = ref<TData[]>([],) as Ref<TData[]>
  const formRef = ref<FormInstance | LayoutFormInstance>()
  const pager = reactive<NewBasicPage>({
    currPage: 1,
    pageSize: defaultPageSize,
    totalCount: 0,
  },)
  const pagerRef = ref<PaginationInstance>()

  const { maxHeight, } = useMaxHeight({
    targetRef: tableRef,
    otherRefs: hasPager ? pagerRef as Ref<ComponentPublicInstance> : undefined,
    offset: offsetHeight,
  },)

  const lastQueryData = ref<TFormData | undefined>(cloneDeep(formData,),)
  const originalFormData = cloneDeep(formData,)

  const transformParams = (params?: TFormData,): TFormData => {
    if (!params) {
      return {} as TFormData
    }
    const clonedParams = cloneDeep(params,)

    // 处理日期范围转换
    dateTransform.forEach(({ source, startField, endField, },) => {
      if (source in clonedParams) {
        const dateRange = clonedParams[source as keyof TFormData]
        if (Array.isArray(dateRange,)) {
          // 确保 dateRange 是可迭代的数组类型
          const startDate = dateRange[0]
          const endDate = dateRange[1]
          clonedParams[startField as keyof TFormData] = startDate
          clonedParams[endField as keyof TFormData] = endDate
        }
      }
    },)

    return omit(clonedParams, dateTransform.map(({ source, },) => source,),) as TFormData
  }
  const queryParams = computed<TParams>(() => {
    const formatData = isFunction(formatParams,) ? formatParams(formData,) : formData
    const transformData = transformParams(formatData,)
    const { currPage: current, pageSize: size, } = pager
    const params = hasPager
      ? { ...transformData, current, size, }
      : { ...transformData, }

    return params as unknown as TParams
  },)

  const { loading, run, cancel, } = useRequest(api, {
    manual: true,
    loadingDelay: 300,
    debounceWait: 200,
    onSuccess(result,) {
      if (result) {
        if (isFunction(afterFetch,)) {
          afterFetch(result,)
          return
        }
        if ("data" in result && result.data) {
          if ("list" in result.data) {
            tableData.value = result.data.list || []
            pager.totalCount = result.data.totalCount
          }
        }
        if ("datas" in result && result?.datas) {
          if ("records" in result.datas) {
            tableData.value = result.datas.records || []
            pager.totalCount = result.datas.pager.total
            return
          }
          tableData.value = result.datas
        }
        return
      }
      tableData.value = []
    },
    onFinally() {
      lastQueryData.value = cloneDeep(formData,)
    },
  },)

  async function handleSearch() {
    const valid = await formRef.value?.validate()
    if (valid || !formRef.value) {
      if (!isEqual(lastQueryData.value, formData,)) {
        pager.currPage = 1
      }
      run(queryParams.value,)
    }
  }

  function handlePagerChange(val: NewBasicPage,) {
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
    lastQueryData: lastQueryData as Ref<TFormData | undefined>,
    cancel,
    handleReset,
    handleSearch,
    handlePagerChange,
  }
}

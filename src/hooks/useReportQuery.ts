import type { LayoutFormInstance, } from "@/components/LayoutForm"
import type { PaginationInstance, } from "@/components/Pagination"
import type { FormInstance, } from "element-plus"
import type { VxeTableInstance, } from "vxe-table"
import { cloneDeep, isEqual, } from "lodash-es"
import { useRequest, } from "vue-hooks-plus"

interface DateTransform<T,> {
  source: string
  startField: keyof T
  endField: keyof T
}

interface Options<TData, TParams,> {
  api: (params: TParams) => Promise<ResponseData<TData[]> | PageResponseData<TData> | undefined>
  formData?: Omit<TParams, "current" | "size">
  autoRequest?: boolean
  hasPager?: boolean
  dateTransform?: DateTransform<TParams>[]
}

interface Return<TData, TParams,> {
  loading: Ref<boolean>
  formRef: Ref<FormInstance | LayoutFormInstance | undefined>
  tableRef: Ref<VxeTableInstance | undefined>
  pager: BasicPage
  pagerRef: Ref<PaginationInstance | undefined>
  queryParams: ComputedRef<TParams>
  tableData: Ref<TData[]>
  handleSearch: () => Promise<void>
  handleReset: () => Promise<void>
  handlePagerChange: (val: BasicPage,) => void
  maxHeight: Ref<number>
}

interface Params extends Partial<PageParams> {
  [key: string]: any
}

export function useReportQuery<TData, TParams extends Params,>(options: Options<TData, TParams>,): Return<TData, TParams> {
  const tableRef = ref<VxeTableInstance>()
  const tableData = ref<TData[]>([],) as Ref<TData[]>
  const formRef = ref<FormInstance | LayoutFormInstance>()
  const pager = reactive<BasicPage>({
    current: 1,
    size: 20,
    total: 0,
  },)
  const pagerRef = ref<PaginationInstance>()

  const {
    api,
    formData,
    hasPager = true,
    autoRequest = true,
    dateTransform = [],
  } = options

  const { maxHeight, } = useMaxHeight({
    targetRef: tableRef,
    otherRefs: hasPager ? pagerRef as Ref<ComponentPublicInstance> : undefined,
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

  const { loading, run, } = useRequest(api, {
    manual: true,
    loadingDelay: 300,
    onSuccess(result,) {
      if (result?.datas) {
        if ("records" in result.datas) {
          tableData.value = result.datas.records
          pager.total = result.datas.pager?.total
          return
        }
        tableData.value = result.datas
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
    onMounted(() => {
      handleSearch()
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
    if (formData) {
      Object.assign(formData, originalFormData,)
    }
    await handleSearch()
  }

  return {
    tableData,
    tableRef,
    formRef,
    loading,
    pager,
    pagerRef,
    maxHeight,
    queryParams,
    handleReset,
    handleSearch,
    handlePagerChange,
  }
}

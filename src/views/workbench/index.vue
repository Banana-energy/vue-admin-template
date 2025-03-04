<script lang="ts" setup>
import type { DescriptionItem, } from "@/components/Descriptions"
import type { ModelListPageAPI, } from "@/views/workbench/apis"
import type { CascaderValue, } from "element-plus"
import { allUserApiConfig, } from "@/apis/userInfo"
import { useEcharts, } from "@/components/EchartsUI"
import EchartsUI from "@/components/EchartsUI/src/EchartsUI.vue"
import { ElCascader, } from "@/components/ElCascader"
import { useDict, } from "@/hooks/useDict.ts"
import { useReportQuery, } from "@/hooks/useReportQuery.ts"
import { useVxeArea, } from "@/hooks/useVxeArea.ts"
import { virtualScrollProps, } from "@/setup/vxe-table"
import { getModelListByPage, } from "@/views/workbench/apis"

const disabled = ref(true,)
const formData = reactive<ModelListPageAPI.Params & {
  date?: DateRange
}>({},)

const {
  tableData,
  tableRef,
  formRef,
  pager,
  pagerRef,
  loading,
  maxHeight,
  handleReset,
  handleSearch,
  handlePagerChange,
} = useReportQuery({
  api: getModelListByPage,
  dateTransform: [{
    source: "date",
    startField: "startTime",
    endField: "endTime",
  },],
  formData,
},)

const preliminaryInvestigationInfo: DescriptionItem[] = [
  { field: "referenceBrand", label: "参考品牌", },
  { field: "productDescription", label: "产品描述", },
  { field: "referenceBrandUrl", label: "参考品牌链接", },
  { field: "sameShoesBrand", label: "同款鞋对应品牌", },
  { field: "searchCategoryItemName", label: "检索分类", span: 2, },
  { field: "riskScreening", label: "风险初筛", },
  { field: "saleSeason", label: "开发季节", },
  { field: "marketFlag", label: "产品是否上市", },
  { field: "needHelpFlag", label: "设计师是否需协助", },
  { field: "productNumber", label: "关联的产品编号", },
  { field: "searchNeed", label: "检索需求", },
  { field: "designerName", label: "设计师", },
  { field: "screeningOperateTime", label: "创建时间", },
]

function handleChange(val: CascaderValue,) {
  console.log(val,)
}
const { dictState, } = useDict()
console.log(dictState,)

const { chartRef, renderEcharts, } = useEcharts()
onMounted(() => {
  renderEcharts({
    grid: {
      bottom: 0,
      containLabel: true,
      left: "1%",
      right: "1%",
      top: "2 %",
    },
    series: [
      {
        areaStyle: {},
        data: [
          111,
          2000,
          6000,
          16_000,
          33_333,
          55_555,
          64_000,
          33_333,
          18_000,
          36_000,
          70_000,
          42_444,
          23_222,
          13_000,
          8000,
          4000,
          1200,
          333,
          222,
          111,
        ],
        itemStyle: {
          color: "#5ab1ef",
        },
        smooth: true,
        type: "line",
      },
      {
        areaStyle: {},
        data: [
          33,
          66,
          88,
          333,
          3333,
          6200,
          20_000,
          3000,
          1200,
          13_000,
          22_000,
          11_000,
          2221,
          1201,
          390,
          198,
          60,
          30,
          22,
          11,
        ],
        itemStyle: {
          color: "#019680",
        },
        smooth: true,
        type: "line",
      },
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#019680",
          width: 1,
        },
      },
      trigger: "axis",
    },
    // xAxis: {
    //   axisTick: {
    //     show: false,
    //   },
    //   boundaryGap: false,
    //   data: Array.from({ length: 18 }).map((_item, index) => `${index + 6}:00`),
    //   type: 'category',
    // },
    xAxis: {
      axisTick: {
        show: false,
      },
      boundaryGap: false,
      data: Array.from({ length: 18, },).map((_item, index,) => `${index + 6}:00`,),
      splitLine: {
        lineStyle: {
          type: "solid",
          width: 1,
        },
        show: true,
      },
      type: "category",
    },
    yAxis: [
      {
        axisTick: {
          show: false,
        },
        max: 80_000,
        splitArea: {
          show: true,
        },
        splitNumber: 4,
        type: "value",
      },
    ],
  },)
},)

const { onTableScroll, } = useVxeArea(tableRef,)
</script>

<template>
  <div>
    <LayoutForm
      ref="formRef"
      :descriptions="preliminaryInvestigationInfo"
      :loading="loading"
      :model="formData"
      query-form
      @reset="handleReset"
      @search="handleSearch"
    >
      <ElFormItem label="测试">
        <ApiSelect
          v-model="formData.productNumber"
          :api-config="allUserApiConfig"
          :component="ElCascader"
          :props="{ multiple: true }"
        />
      </ElFormItem>
      <ElFormItem label="测试">
        <DictSelect
          v-model="formData.code"
          dict-code="COMMON_YES_NO"
        />
        <DictSelect
          v-model="formData.code"
          dict-code="PRODUCT_ARCH_TYPE"
        />
      </ElFormItem>
      <ElFormItem class="!bg-primary" label="测试">
        <ElSwitch v-model="disabled" />
      </ElFormItem>
      <ElFormItem label="测试">
        <ElCascader
          v-model="formData.styleWms"
          :options="preliminaryInvestigationInfo"
          :props="{ value: 'field', label: 'field', emitPath: false }"
          filterable
          @change="handleChange"
        />
      </ElFormItem>
      <!--      <ElFormItem :span="12" label="测试"> -->
      <!--        <ElCascader -->
      <!--          v-model="formData.styleWms" -->
      <!--          :options="preliminaryInvestigationInfo" -->
      <!--          :props="{ value: 'field', label: 'field', emitPath: false }" -->
      <!--          filterable -->
      <!--          @change="handleChange" -->
      <!--        /> -->
      <!--      </ElFormItem> -->
      <!--      <ElFormItem label="测试"> -->
      <!--        <ElCascader -->
      <!--          v-model="formData.styleWms" -->
      <!--          :options="preliminaryInvestigationInfo" -->
      <!--          :props="{ value: 'field', label: 'field', emitPath: false }" -->
      <!--          filterable -->
      <!--          @change="handleChange" -->
      <!--        /> -->
      <!--      </ElFormItem> -->
      <!--      <ElFormItem label="测试"> -->
      <!--        <ElDatePicker v-model="formData.date" type="daterange" /> -->
      <!--      </ElFormItem> -->
    </LayoutForm>
    <VxeTable
      v-if="disabled"
      ref="tableRef"
      :data="tableData"
      :loading="loading"
      :max-height="maxHeight"
      v-bind="virtualScrollProps"
      @scroll="onTableScroll"
    >
      <VxeColumn
        fixed="left"
        type="seq"
        width="500"
        row-resize
      />
      <VxeColumn
        field="code"
        title="型体编码"
        width="90"
      />
      <VxeColumn field="brandItemName" min-width="100" title="品牌" />
      <VxeColumn field="developmentYearItemName" title="开发年份" width="80" />
      <VxeColumn field="regionItemName" min-width="100" title="区域" />
      <VxeColumn field="targetAudienceItemName" min-width="100" title="适用人群" />
      <VxeColumn
        field="productNumber"
        min-width="120"
        title="关联的产品"
      />
      <VxeColumn
        field="status"
        fixed="right"
        title="状态"
        width="80"
      />
      <VxeColumn field="modifyByIdItemName" title="操作人" width="120" />
      <VxeColumn field="modifyTime" title="操作时间" width="80" />
      <VxeColumn
        fixed="right"
        title="操作"
        width="120"
      >
        <template #default>
          <ElButton
            type="primary"
            link
          >
            版本记录
          </ElButton>
        </template>
      </VxeColumn>
    </VxeTable>
    <Pagination ref="pagerRef" :pager="pager" @change="handlePagerChange" />
    <EchartsUI ref="chartRef" />
    <Descriptions :border="false" :descriptions="preliminaryInvestigationInfo" title="测试" />
    <RichTextEditor v-model="formData.code" :disabled="disabled" use-oss />
  </div>
</template>

<style lang="scss" scoped>

</style>

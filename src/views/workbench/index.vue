<script lang="ts" setup>
import type { DescriptionItem, } from "@/components/Descriptions"
import type { ModelListPageAPI, } from "@/views/workbench/apis"
import type { CascaderValue, } from "element-plus"
import type { VxeTableInstance, } from "vxe-table"
import { allUserApiConfig, } from "@/apis/userInfo"
import { ElCascader, } from "@/components/ElCascader"
import { useMaxHeight, } from "@/hooks/useMaxHeight.ts"
import { getModelListByPage, } from "@/views/workbench/apis"
import { useRequest, } from "vue-hooks-plus"

const tableRef = ref<VxeTableInstance>()
const disabled = ref(false,)
const formData = reactive<ModelListPageAPI.Params & {
  date?: DateRange
}>({},)
const pager = reactive<BasicPage>({
  current: 1,
  size: 10,
  total: 0,
},)

const { data, loading, } = useRequest(() => getModelListByPage({
  ...formData,
  ...pager,
},), {
  loadingDelay: 500,
},)

const tableData = computed(() => data.value?.datas?.records,)

const { maxHeight, } = useMaxHeight({
  targetRef: tableRef,
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
</script>

<template>
  <div>
    <LayoutForm
      :descriptions="preliminaryInvestigationInfo"
      :loading="loading"
      :model="formData"
      query-form
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
      <ElFormItem :span="12" label="测试">
        <ElDatePicker v-model="formData.date" type="daterange" />
      </ElFormItem>
    </LayoutForm>
    <VxeTable ref="tableRef" :data="tableData" :max-height="maxHeight">
      <VxeColumn type="seq" width="70" row-resize />
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
    <Descriptions :border="false" :descriptions="preliminaryInvestigationInfo" title="测试" />
    <RichTextEditor v-model="formData.code" :disabled="disabled" use-oss />
  </div>
</template>

<style lang="scss" scoped>

</style>

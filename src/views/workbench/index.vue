<script lang="ts" setup>
import type { DescriptionItem, } from "@/components/Descriptions"
import type { CascaderValue, } from "element-plus"

const value = ref("",)
const disabled = ref(false,)
const tableData = ref([
  { id: 10001, name: "Test1", role: "Develop", sex: "Man", age: 28, address: "test abc", },
  { id: 10002, name: "Test2", role: "Test", sex: "Women", age: 22, address: "Guangzhou", },
  { id: 10003, name: "Test3", role: "PM", sex: "Man", age: 32, address: "Shanghai", },
  { id: 10004, name: "Test4", role: "Designer", sex: "Women", age: 24, address: "Shanghai", },
],)

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
    <ElForm label-position="top">
      <DictSelect v-model="value" dict-code="COMMON_YES_NO" />
      <DictSelect v-model="value" dict-code="COMMON_YES_NO" />
      <ElFormItem label="测试">
        <ElSwitch v-model="disabled" />
      </ElFormItem>
      <ElCascader
        v-model="value"
        :options="preliminaryInvestigationInfo"
        :props="{ value: 'field', label: 'field', emitPath: false }"
        filterable
        @change="handleChange"
      />
      <BaseUpload />
    </ElForm>
    <VxeTable :data="tableData">
      <VxeColumn type="seq" width="70" row-resize />
      <VxeColumn field="name" title="Name" />
      <VxeColumn field="sex" title="Sex" />
      <VxeColumn field="age" title="Age" />
      <VxeColumn field="time" title="Time" />
      <VxeColumn field="address" title="Address" />
    </VxeTable>
    <Descriptions :border="false" :descriptions="preliminaryInvestigationInfo" title="测试" />
    <RichTextEditor v-model="value" :disabled="disabled" use-oss />
  </div>
</template>

<style lang="scss" scoped>

</style>

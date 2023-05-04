<template>
  <el-form
    :inline="true"
    :model="formInline"
  >
    <el-form-item label="Approved by">
      <el-input
        v-model="formInline.user"
        placeholder="Approved by"
      />
    </el-form-item>
    <el-form-item label="Approved Time">
      <el-date-picker
        v-model="formInline.time"
        end-placeholder="End Date"
        start-placeholder="Start Date"
        type="datetimerange"
      />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select
        v-model="formInline.region"
        placeholder="Activity zone"
      >
        <el-option
          label="Zone one"
          value="shanghai"
        />
        <el-option
          label="Zone two"
          value="beijing"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit"
      >
        Query
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
const formInline = reactive({
  user: "",
  region: "",
  time: "",
});

const onSubmit = () => {
  console.log("submit!");
};
</script>

<style scoped lang="scss"></style>

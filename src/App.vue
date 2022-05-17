<template>
  <el-config-provider :locale="zhCn">
    {{ i18n.get("test") }}
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import i18n from "./lang";
</script>

<style></style>

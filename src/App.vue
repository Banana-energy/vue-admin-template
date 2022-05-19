<template>
  <el-config-provider :locale="language">
    {{ i18n.get("test") }}
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { i18n, getCurrentMessage } from "./lang";

const language = getCurrentMessage();
</script>

<style></style>

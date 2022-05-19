<template>
  <el-config-provider :locale="language">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { getCurrentMessage } from "./lang";

const language = getCurrentMessage();
</script>

<style></style>

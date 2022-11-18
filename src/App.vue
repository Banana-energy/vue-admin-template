<template>
  <el-config-provider :locale="languages">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { useLanguageStore } from "./store/modules/lang";
import { messages } from "@/lang";

const { language } = storeToRefs(useLanguageStore());
const languages = computed(() => {
  return messages[language.value];
});
</script>

<style></style>

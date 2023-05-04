<template>
  <el-dropdown @command="handleSetLanguage">
    <i-cil-language
      class="text-xl mr-4"
      style="color: #000000bf"
    />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          command="zh_CN"
          :disabled="language === 'zh_CN'"
        >
          中文
        </el-dropdown-item>
        <el-dropdown-item
          command="en_US"
          :disabled="language === 'en_US'"
        >
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useLanguageStore } from "@/store/modules/lang";
import { i18n } from "@/lang";
const store = useLanguageStore();
const language = computed(() => {
  return store.language;
});
const handleSetLanguage = (lang: string) => {
  i18n.setLang && i18n.setLang("zh_CN");
  store.setLanguage(lang);
};
</script>

<style scoped></style>

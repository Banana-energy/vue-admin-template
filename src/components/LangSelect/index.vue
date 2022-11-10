<template>
  <el-dropdown @command="handleSetLanguage">
    <i-cil-language
      style="color: #000000bf"
      class="text-xl mr-4 outline-none"
    />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh_CN'" command="zh_CN">
          中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en_US'" command="en_US">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts" name="LangSelect">
import { useLanguageStore } from "@/store/modules/lang";
import { i18n } from "@/lang";

const store = useLanguageStore();
const { language } = storeToRefs(store);
const handleSetLanguage = (lang: string) => {
  i18n.setLang?.(lang);
  store.setLanguage(lang);
  location.reload();
};
</script>

<style scoped></style>

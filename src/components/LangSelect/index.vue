<template>
  <el-dropdown @command="handleSetLanguage">
    <icon
      class="mr-4 outline-none"
      :height="24"
      icon="vscode-icons:file-type-locale"
      :width="24"
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

<script setup lang="ts" name="LangSelect">
import { Icon } from "@iconify/vue";
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

<template>
	<el-dropdown @command="handleSetLanguage">
		<icon
			:height="24"
			:width="24"
			class="mr-4 outline-none"
			icon="vscode-icons:file-type-locale"
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

<script setup>
import { Icon } from "@iconify/vue";
import { useLanguageStore } from "@/store/modules/lang";
import { i18n } from "@/lang";

defineOptions({
  name: "LangSelect"
});

const store = useLanguageStore();
const { language } = storeToRefs(store);
const handleSetLanguage = (lang) => {
  i18n.setLang?.(lang);
  store.setLanguage(lang);
  location.reload();
};
</script>

<style scoped></style>

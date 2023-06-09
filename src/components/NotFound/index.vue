<template>
	<div class="flex justify-center">
		<div class="text-center">
			<img :src="NotFound" alt="" width="350" />
			<div class="text-14px text-[var(--el-color-info)]">
				抱歉，您访问的页面不存在。
			</div>
			<div class="mt-20px">
				<el-button type="primary" @click="btnClick"> 返回首页 </el-button>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import NotFound from "@/assets/svgs/NotFound.svg";
const router = useRouter();
const btnClick = () => {
  router.push("/");
};
</script>

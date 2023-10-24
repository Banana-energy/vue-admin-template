<template>
	<el-breadcrumb class="app-breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
				<span
					v-if="
						item.meta.redirect === 'noRedirect' || index === levelList.length - 1
					"
					class="no-redirect"
				>
					{{ item.meta.title }}
				</span>
				<a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script setup>
import { compile } from 'path-to-regexp';

defineOptions({
  name: 'Breadcrumb'
});

const levelList = ref([]);
const route = useRoute();
const router = useRouter();

const isDashboard = (route) => {
  const name = route?.name;
  if (!name || typeof name === 'symbol') {
    return false;
  }
  return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase();
};

const getBreadcrumb = () => {
  let matched = route.matched.filter((item) => item.meta?.title);
  const first = matched[0];
  if (!isDashboard(first)) {
    // TODO 添加首页路由
    //matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
  }
  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );
};

watch(
  route,
  () => {
    getBreadcrumb();
  },
  { immediate: true }
);

const pathCompile = (path) => {
  const { params } = route;
  const toPath = compile(path);
  return toPath(params);
};

const handleLink = (item) => {
  const { redirect, path } = item;
  if (redirect && typeof redirect === 'string') {
    router.push(redirect);
    return;
  }
  router.push(pathCompile(path));
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>

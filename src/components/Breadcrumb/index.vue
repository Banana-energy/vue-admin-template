<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="
            item.meta.redirect === 'noRedirect' || index == levelList.length - 1
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

<script lang="ts" setup>
import pathToRegexp from "path-to-regexp";
import { watch, ref } from "vue";
import { useRoute, useRouter, RouteLocationMatched } from "vue-router";

const levelList = ref<RouteLocationMatched[]>([]);
const route = useRoute();
const router = useRouter();

watch(
  route,
  () => {
    getBreadcrumb();
  },
  { immediate: true }
);

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

const isDashboard = (route: RouteLocationMatched) => {
  const name = route.name;
  if (!name || typeof name === "symbol") {
    return false;
  }
  return name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase();
};

const pathCompile = (path: string) => {
  const { params } = route;
  var toPath = pathToRegexp.compile(path);
  return toPath(params);
};

const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item;
  if (redirect && typeof redirect === "string") {
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

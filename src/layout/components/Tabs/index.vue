<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <el-tabs
        v-model="tabsMenuValue"
        type="card"
        @tab-click="tabClick"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="item in tabsMenuList"
          :key="item.path"
          :path="item.path"
          :label="item.meta?.title"
          :name="item.path"
          :closable="item.path === '/dashboard' ? false : true"
        >
          <template #label>
            <el-icon v-if="item.meta?.icon" class="tabs-icon">
              <component :is="item.meta?.icon" />
            </el-icon>
            {{ item.meta?.title }}
          </template>
        </el-tab-pane>
      </el-tabs>
      <more-button />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTabsState } from "@/store/modules/tabs";
import { TabPanelName, TabsPaneContext } from "element-plus";
import MoreButton from "./components/MoreButton.vue";
import Layout from "@/layout/index.vue";

const tabStore = useTabsState();

const tabsMenuList = computed(() => tabStore.tabsMenuList);
const tabsMenuValue = computed({
  get: () => {
    return tabStore.tabsMenuValue;
  },
  set: (val) => {
    tabStore.setTabsMenuValue(val);
  },
});

const route = useRoute();
const router = useRouter();
// 监听路由的变化（防止后退前进不变化 tabsMenuValue）
watch(
  () => route.path,
  () => {
    let params = {
      meta: { title: route.meta.title as string },
      path: route.path,
      component: Layout,
    };
    tabStore.addTabs(params);
  },
  {
    immediate: true,
  }
);

// Tab Click
const tabClick = (tabItem: TabsPaneContext) => {
  let path = tabItem.props.name as string;
  router.push(path);
};

// Remove Tab
const removeTab = (activeTabPath: TabPanelName) => {
  tabStore.removeTabs(activeTabPath as string);
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

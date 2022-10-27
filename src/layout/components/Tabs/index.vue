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
          :label="item.title"
          :name="item.path"
          :closable="item.close"
        >
          <template #label>
            <el-icon v-if="item.icon" class="tabs-icon">
              <component :is="item.icon" />
            </el-icon>
            {{ item.title }}
          </template>
        </el-tab-pane>
      </el-tabs>
      <!-- <MoreButton></MoreButton> -->
    </div>
  </div>
</template>

<script lang="ts" setup name="Tabs">
import { useTabsStore } from "@/store/modules/tabs";
import { TabsPaneContext, TabPanelName } from "element-plus";

const tabStore = useTabsStore();
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
    const params = {
      title: route.meta.title,
      path: route.path,
      close: true,
    };
    tabStore.addTabs(params);
  },
  {
    immediate: true,
  }
);
// Tab Click
const tabClick = (tabItem: TabsPaneContext) => {
  const path = tabItem.props.name.toString();
  router.push(path);
};
// Remove Tab
const removeTab = (name: TabPanelName) => {
  tabStore.removeTabs(name);
};
</script>

<style lang="scss" scoped>
$bg-color: #409eff;
.tabs-box {
  :deep(.tabs-menu) {
    width: 100%;
    position: relative;

    .el-dropdown {
      position: absolute;
      right: 13px;
      top: 8px;
    }

    .tabs-icon {
      top: 2px;
    }

    .el-tabs__nav-wrap {
      position: absolute;
      width: calc(100% - 120px);
    }

    .el-tabs--card > .el-tabs__header {
      height: 40px;
      padding: 0;
      box-sizing: border-box;
      margin: 0;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item {
      color: #ccc;
      border: none;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
      color: $bg-color;
      border-bottom: 2px solid $bg-color;
    }
  }
}
</style>

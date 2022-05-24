import { RouteRecordRaw } from "vue-router";
import { HOME_URL, TABS_BLACK_LIST } from "@/config/config";
import router from "@/router/index";
import { TabPaneProps } from "element-plus";

// layout
import Layout from "@/layout/index.vue";

interface ITabsState {
  tabsMenuValue: string;
  tabsMenuList: RouteRecordRaw[];
}

export const useTabsState = defineStore("useTabsState", {
  state: (): ITabsState => ({
    tabsMenuValue: HOME_URL,
    tabsMenuList: [
      {
        path: "/dashboard",
        component: Layout,
        meta: { title: "Dashboard", icon: "HomeFilled" },
      },
    ],
  }),
  actions: {
    // Add Tabs
    async addTabs(tabItem: RouteRecordRaw) {
      // not add tabs black list
      if (TABS_BLACK_LIST.includes(tabItem.path)) return;
      const tabInfo: RouteRecordRaw = {
        path: tabItem.path,
        meta: { title: tabItem.meta?.title },
        component: Layout,
      };
      if (this.tabsMenuList.every((item) => item.path !== tabItem.path)) {
        this.tabsMenuList.push(tabInfo);
      }
      this.setTabsMenuValue(tabItem.path);
      router.push(tabItem.path);
    },
    // Remove Tabs
    async removeTabs(tabPath: string) {
      let tabsMenuValue = this.tabsMenuValue;
      const tabsMenuList = this.tabsMenuList;
      if (tabsMenuValue === tabPath) {
        tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return;
          const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
          if (!nextTab) return;
          tabsMenuValue = nextTab.path;
          router.push(nextTab.path);
        });
      }
      this.tabsMenuValue = tabsMenuValue;
      this.tabsMenuList = tabsMenuList.filter((item) => item.path !== tabPath);
    },
    // Change Tabs
    async changeTabs(tabItem: TabPaneProps) {
      this.tabsMenuList.forEach((item) => {
        if (item.meta?.title === tabItem.label) router.push(item.path);
      });
    },
    // Set TabsMenuValue
    async setTabsMenuValue(tabsMenuValue: string) {
      this.tabsMenuValue = tabsMenuValue;
    },
    // Set TabsMenuList
    async setTabsMenuList(tabsMenuList: RouteRecordRaw[]) {
      this.tabsMenuList = tabsMenuList;
    },
    // Close MultipleTab
    async closeMultipleTab(tabsMenuValue?: string) {
      this.tabsMenuList = this.tabsMenuList.filter((item) => {
        return item.path === tabsMenuValue || item.path === HOME_URL;
      });
    },
    // Go Home
    async goHome() {
      router.push(HOME_URL);
      this.tabsMenuValue = HOME_URL;
    },
  },
});

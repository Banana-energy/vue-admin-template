import { HOME_URL, TABS_BLACK_LIST } from "@/config/config";
import router from "@/router";
import { TabPanelName, TabPaneProps } from "element-plus";

interface MenuOptions {
  path: string;
  title?: string;
  icon?: string;
  isLink?: string;
  close?: boolean;
  children?: MenuOptions[];
}

interface TabsState {
  tabsMenuValue: string;
  tabsMenuList: MenuOptions[];
}

export const useTabsStore = defineStore({
  id: "TabsState",
  state: (): TabsState => ({
    tabsMenuValue: HOME_URL,
    tabsMenuList: [
      { title: "Dashboard", path: HOME_URL, icon: "home-filled", close: false },
    ],
  }),
  getters: {},
  actions: {
    // Add Tabs
    async addTabs(tabItem: MenuOptions) {
      // not add tabs black list
      if (TABS_BLACK_LIST.includes(tabItem.path)) return;
      const tabInfo: MenuOptions = {
        title: tabItem.title,
        path: tabItem.path,
        close: tabItem.close,
      };
      if (this.tabsMenuList.every((item) => item.path !== tabItem.path)) {
        this.tabsMenuList.push(tabInfo);
      }
      this.setTabsMenuValue(tabItem.path);
      router.push(tabItem.path);
    },
    // Remove Tabs
    async removeTabs(tabPath: TabPanelName) {
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
        if (item.title === tabItem.label) router.push(item.path);
      });
    },
    // Set TabsMenuValue
    async setTabsMenuValue(tabsMenuValue: string) {
      this.tabsMenuValue = tabsMenuValue;
    },
    // Set TabsMenuList
    async setTabsMenuList(tabsMenuList: MenuOptions[]) {
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

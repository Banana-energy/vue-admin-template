import { defineStore } from "pinia";

interface ISetting {
  isCollapse: boolean;
}

export const settingStore = defineStore("setting", {
  state: (): ISetting => ({
    isCollapse: false,
  }),
  actions: {
    async setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
});

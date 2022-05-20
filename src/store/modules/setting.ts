interface ISetting {
  isCollapse: boolean;
}

export const useSettingStore = defineStore("setting", {
  state: (): ISetting => ({
    isCollapse: false,
  }),
  actions: {
    setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
});

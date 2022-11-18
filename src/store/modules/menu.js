export const useMenuStore = defineStore("MenuStore", {
  state: () => ({
    isCollapse: false,
  }),
  actions: {
    setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
});

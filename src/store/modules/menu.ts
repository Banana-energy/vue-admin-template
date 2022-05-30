interface MenuState {
  isCollapse: boolean;
}

export const useMenuStore = defineStore("MenuStore", {
  state: (): MenuState => ({
    isCollapse: false,
  }),
  actions: {
    setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
});

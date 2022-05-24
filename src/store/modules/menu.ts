interface IMenuState {
  isCollapse: boolean;
}

export const useMenuState = defineStore("MenuState", {
  state: (): IMenuState => ({
    isCollapse: false,
  }),
  actions: {
    setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
});

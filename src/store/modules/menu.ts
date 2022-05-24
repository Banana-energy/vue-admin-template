interface IMenuStore {
  isCollapse: boolean;
}

export const useMenuStore = defineStore("MenuStore", {
  state: (): IMenuStore => ({
    isCollapse: false,
  }),
  actions: {
    setCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
});

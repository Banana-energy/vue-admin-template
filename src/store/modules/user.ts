interface UserState {
  name?: string;
  token?: string;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({}),
  actions: {
    async login() {
      // nothing
    },
    async logout() {
      // nothing
    },
    async getUserInfo() {
      // nothing
    },
    resetToken() {
      return new Promise((resolve) => {
        //removeAuthInfo();
        this.token = "";
        resolve(true);
      });
    },
  },
});

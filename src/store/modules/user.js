import { getUserInfo, login, logout } from "@/api/user";
import { useToken } from "@/utils/auth";

const { getToken, setToken, removeToken } = useToken();

const getDefaultState = () => ({
  name: "",
  token: getToken(),
  roles: [],
});

export const useUserStore = defineStore("userStore", {
  state: getDefaultState,
  actions: {
    async login(userInfo) {
      const { username, password } = userInfo;
      const [error, result] = await login({ username, password });
      if (!error && result) {
        this.token = result.data;
        setToken(result.data);
        return true;
      }
      return false;
    },
    async logout() {
      const [error] = await logout();
      if (!error) {
        removeToken();
        this.resetState();
        return true;
      }
      return false;
    },
    async getUserInfo() {
      const { token } = this;
      if (token) {
        const [error, result] = await getUserInfo({ token });
        if (!error && result) {
          const {
            data: { roles },
          } = result;
          this.roles = roles;
          return roles;
        }
        return false;
      }
      return false;
    },
    resetState() {
      this.$state = getDefaultState();
    },
  },
});

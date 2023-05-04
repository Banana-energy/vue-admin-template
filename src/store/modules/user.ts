import { getUserInfo, IReqLogin, login, logout } from "@/api/user";
import { useToken } from "@/utils/auth";

const { getToken, setToken, removeToken } = useToken();

interface UserState {
  name?: string | null;
  token?: string | null;
  roles?: string[] | null;
}

const getDefaultState = (): UserState => ({
  name: "",
  token: getToken(),
  roles: [],
});

export const useUserStore = defineStore("userStore", {
  state: getDefaultState,
  actions: {
    async login(userInfo: IReqLogin) {
      const { username, password } = userInfo;
      const [error, result] = await login({ username, password });
      if (!error && result) {
        if (result.data) {
          this.token = result.data;
          setToken(result.data);
          return true;
        }
        return false;
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
          const { data } = result;
          if (data?.roles) {
            this.roles = data.roles;
            return data.roles;
          }
          return false;
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

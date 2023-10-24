import { getUserInfo, logout } from '@/api/user';
import { useToken } from '@/utils/auth';

const { getToken, setToken, removeToken } = useToken();

const getDefaultState = () => ({
  name: '',
  avatarUrl: '',
  userId: '',
  email: '',
  roles: [],
});

export const useUserStore = defineStore('UserStore', {
  state: getDefaultState,
  actions: {
    async logout() {
      const [ error, result ] = await logout();
      if (!error && result) {
        removeToken();
        this.resetState();
        return result.data;
      }
      return false;
    },
    async getUserInfo() {
      const [ error, result ] = await getUserInfo();
      if (!error && result) {
        const { datas } = result;
        this.$state = datas || {};
        return datas;
      }
      return false;
    },
    resetState() {
      this.$state = getDefaultState();
    },
  },
});

import { getUserResByMenuId } from '@/api/permission';

const modules = import.meta.glob('../views/**/*.{vue,tsx}');
const Layout = () => import('@/layout/index.vue');

function generateRoutes(routes) {
  const res = [];
  for (const route of routes) {
    const data = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
      meta: {
        ...route.meta,
        hidden: route.hidden,
        ...route?.configure
      }
    };
    if (route.component) {
      for (const path in modules) {
        if (path && path.includes(route.component + '.vue')) {
          data.component = modules[path];
        }
      }
      if (route.component === 'Layout') {
        data.component = Layout;
      }
    }
    if (route.children) {
      data.children = generateRoutes(route.children);
    }
    res.push(data);
  }
  return res;
}

export const usePermissionStore = defineStore('PermissionStore', {
  state: () => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    resList: [],
    skipAuth: false
  }),
  actions: {
    setIsAddRouters(state) {
      this.isAddRouters = state;
    },
    generateRoutes(routes) {
      this.addRouters = generateRoutes(routes);
    },
    async setResList(id) {
      const [ error, result ] = await getUserResByMenuId(id);
      if (!error && result) {
        this.resList = result.res;
        this.skipAuth = result.skipAuth;
        return true;
      }
      return false;
    }
  }
});

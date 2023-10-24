import { createRouter, createWebHistory } from 'vue-router';
import { done, start } from '@/utils/nprogress';
import { useUserStore } from '@/store/modules/user';
import config from '@/constants/env.config';
import env from '@/constants/env.config';
// layout
import Layout from '@/layout/index.vue';
import { useToken } from '@/utils/auth';
import { usePermissionStore } from '@/store/modules/permission';
import { getUserMenus } from '@/api/permission';

const DEFAULT_DOCUMENT_TITLE = env.appTitle;

/**
 * @description: 根据路由名称查找路由
 * @param {Array} routes 路由列表
 * @param {String} name 路由名称
 * @return {Object} 路由信息
 **/
function findRouteByName(routes, name) {
  for (const route of routes) {
    if (route.name === name) {
      return route;
    } else if (route.children) {
      const found = findRouteByName(route.children, name);
      if (found) {
        return found;
      }
    }
  }
}

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true, notRequiredAuth: true },
  },

  {
    path: '/',
    component: Layout,
    meta: {
      title: 'Dashboard',
      icon: 'vscode-icons:file-type-jpm',
      activeMenu: '/dashboard',
    },
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
      },
    ],
  },

  {
    path: '/system',
    component: Layout,
    name: 'System',
    redirect: '/system/roles',
    meta: { title: 'System', icon: 'vscode-icons:file-type-rust-toolchain' },
    children: [
      {
        path: '/system/roles',
        name: 'Roles',
        meta: { title: 'Roles', icon: 'vscode-icons:file-type-robots' },
        component: () => import('@/views/system/roles.vue'),
      },
      {
        path: '/system/user',
        name: 'User',
        meta: { title: 'User', icon: 'vscode-icons:file-type-travis' },
        component: () => import('@/views/system/roles.vue'),
      },
    ],
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'vscode-icons:file-type-pulumi' },
    children: [
      {
        path: '/example/table',
        name: 'Table',
        component: () => import('@/views/table/index.vue'),
        meta: { title: 'Table', icon: 'vscode-icons:file-type-registry' },
      },
      {
        path: '/example/tree',
        name: 'Tree',
        component: () => import('@/views/tree/index.vue'),
        meta: { title: 'Tree', icon: 'vscode-icons:file-type-registry' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/components/NotFound/index.vue'),
    meta: {
      title: '404',
      showMenu: false,
      hidden: true,
      notRequiredAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes,
});

const { getToken, setToken, removeToken } = useToken();

router.beforeEach(async (to, from) => {
  start();
  const params = to.query;
  const tokenName = config.tokenName;
  if (params[tokenName] && typeof params[tokenName] === 'string') {
    setToken(params[tokenName]);
    done();
    return {
      path: to.path,
      query: { ...to.query, [tokenName]: null },
      replace: true,
    };
  }
  if (to.meta.notRequiredAuth) {
    done();
    return true;
  }
  const store = useUserStore();
  const hasUserInfo = store.userId;
  if (!hasUserInfo) {
    const userInfo = await store.getUserInfo();
    if (userInfo) {
      return true;
    } else {
      // remove token and go to login page to re-login
      removeToken();
      store.resetState();
      done();
      return {
        name: 'NotFound',
        replace: true,
      };
    }
  }
  const permissionStore = usePermissionStore();
  if (permissionStore.isAddRouters) {
    const route = findRouteByName(permissionStore.routers, to.name);
    if (route?.id) {
      await permissionStore.setResList(route.id);
    }
    return true;
  }
  const [ error, result ] = await getUserMenus();
  await permissionStore.generateRoutes(result.datas);
  permissionStore.addRouters.forEach((route) => {
    router.addRoute(route);
  });
  const redirectPath = from.query.redirect || to.path;
  const redirect = decodeURIComponent(redirectPath);
  const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
  permissionStore.setIsAddRouters(true);
  done();
  return nextData;
});

router.afterEach((to) => {
  document.title =
    typeof to.meta.title === 'string'
      ? to.meta.title + '-' + DEFAULT_DOCUMENT_TITLE
      : DEFAULT_DOCUMENT_TITLE;
  done();
});

export default router;

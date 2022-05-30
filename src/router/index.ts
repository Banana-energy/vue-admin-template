import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { start, done } from "@/utils/nprogress";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";

const DEFAULT_DOCUMENT_TITLE = "Vue-Admin-Template";

// layout
import Layout from "@/layout/index.vue";
import { getToken } from "@/utils/auth";

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    component: Layout,
    meta: { title: "Dashboard", icon: "HomeFilled", activeMenu: "/dashboard" },
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },

  {
    path: "/example",
    component: Layout,
    redirect: "/example/table",
    name: "Example",
    meta: { title: "Example", icon: "Menu" },
    children: [
      {
        path: "/example/table",
        name: "Table",
        component: () => import("@/views/table/index.vue"),
        meta: { title: "Table", icon: "Menu" },
      },
      {
        path: "/example/tree",
        name: "Tree",
        component: () => import("@/views/tree/index.vue"),
        meta: { title: "Tree", icon: "Menu" },
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showMenu: false,
      hidden: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes,
});

router.beforeEach(async (to) => {
  start();
  document.title =
    typeof to.meta.title === "string"
      ? to.meta.title + "-" + DEFAULT_DOCUMENT_TITLE
      : DEFAULT_DOCUMENT_TITLE;
  const hasAuth = getToken();
  if (hasAuth) {
    if (to.name === "Login") {
      return "/";
    } else {
      const store = useUserStore();
      const hasGetUserInfo = store.roles?.length;
      if (hasGetUserInfo) {
        return true;
      } else {
        // get user info
        const roles = await store.getUserInfo();
        if (roles) {
          return true;
        } else {
          // remove token and go to login page to re-login
          store.resetState();
          ElMessage.error({
            message: "Has Error",
          });
          return `/login?redirect=${to.fullPath}`;
        }
      }
    }
  } else {
    const { meta } = to;
    if (meta.requiresAuth) {
      return `/login?redirect=${to.fullPath}`;
    }
    return true;
  }
});

router.afterEach(() => {
  done();
});

export default router;

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { start, done } from "@/utils/nprogress";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";

const DEFAULT_DOCUMENT_TITLE = "美迈后台管理平台";

// layout
import Layout from "@/layout/index.vue";

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    redirect: "/dashboard",
    meta: { hidden: true },
  },

  {
    path: "/dashboard",
    component: Layout,
    meta: { title: "Dashboard", icon: "HomeFilled" },
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "Dashboard" },
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

const hasAuth = () => false;

router.beforeEach(async (to) => {
  start();
  document.title =
    typeof to.meta.title === "string"
      ? to.meta.title + "-" + DEFAULT_DOCUMENT_TITLE
      : DEFAULT_DOCUMENT_TITLE;
  if (hasAuth()) {
    if (to.name === "Login") {
      done();
      return "/index";
    } else {
      const store = useUserStore();
      const hasGetUserInfo = store.name;
      if (hasGetUserInfo) {
        return true;
      } else {
        try {
          // get user info
          await store.getUserInfo();
          return true;
        } catch (error) {
          // remove token and go to login page to re-login
          await store.resetToken();
          ElMessage.error({
            message: "Has Error",
          });
          done();
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

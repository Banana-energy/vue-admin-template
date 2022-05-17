import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { start, done } from "@/utils/nprogress";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";

const DEFAULT_DOCUMENT_TITLE = "美迈后台管理平台";

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login-index.vue"),
    meta: {
      hidden: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/login/login-index.vue"),
    meta: {
      title: "登录",
      showMenu: false,
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
      ? DEFAULT_DOCUMENT_TITLE + "-" + to.meta.title
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
    const meta = to.meta;
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

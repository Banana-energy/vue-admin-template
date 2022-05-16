import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { start, done } from "@/utils/nprogress";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";

const DEFAULT_DOCUMENT_TITLE = "美迈后台管理平台";

/**
 * 可配置的 meta 属性如下
 */
type Meta = {
  title?: string; // 页面标题
  requiresAuth?: boolean; // 是否需要登录
  activeMenu?: string; // 当前激活的菜单
  breadcrumb?: boolean; // 面包屑
};

type ExpandRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean; // 是否隐藏
  meta?: Meta;
};

export const constantRoutes: ExpandRouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    hidden: true,
    component: () => import("@/views/login/login-index.vue"),
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
    const meta = to.meta as Meta;
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

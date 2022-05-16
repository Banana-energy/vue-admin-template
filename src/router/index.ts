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
  breadcrumb?: boolean; // 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
  roles?: string[];
  affix?: boolean; // 如果设置为true，它则会固定在tags-view中(默认 false)
  // 当路由设置了该属性，则会高亮相对应的侧边栏。
  // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
  // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
  activeMenu?: string; // 当前激活的菜单
};

type ExpandRouteRecordRaw = RouteRecordRaw & {
  hidden?: boolean; // 是否隐藏
  redirect?: string; //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
  meta?: Meta;
  // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
  alwaysShow?: boolean;
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

import { createRouter, createWebHistory } from "vue-router";
import { start, done } from "@/utils/nprogress";
import { useUserStore } from "@/store/modules/user";
import { useToken } from "@/utils/auth";
import Layout from "@/layout/index.vue";
import config from "@/constants/env.config";

const DEFAULT_DOCUMENT_TITLE = config.appTitle;

// layout

export const constantRoutes = [
  {
    path: "/",
    component: Layout,
    meta: {
      title: "产品打标",
      icon: "vscode-icons:file-type-jpm",
      activeMenu: "/product-marking",
    },
    redirect: "/product-marking",
    children: [
      {
        path: "/product-marking",
        name: "ProductMarking",
        component: () => import("@/components/NotFound/index.vue"),
      },
    ],
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/components/NotFound/index.vue"),
    meta: {
      title: "404",
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

router.beforeEach(async (to) => {
  start();
  document.title =
    typeof to.meta.title === "string"
      ? to.meta.title + "-" + DEFAULT_DOCUMENT_TITLE
      : DEFAULT_DOCUMENT_TITLE;
  const { setToken, removeToken } = useToken();
  const params = to.query;
  const tokenName = config.tokenName;
  if (params[tokenName] && typeof params[tokenName] === "string") {
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
  const hasGetUserInfo = store.userId;
  if (hasGetUserInfo) {
    return true;
  } else {
    // get user info
    const userInfo = await store.getUserInfo();
    if (userInfo) {
      return true;
    } else {
      // remove token and go to login page to re-login
      removeToken();
      store.resetState();
      done();
      return {
        name: "NotFound",
        replace: true,
      };
    }
  }
});

router.afterEach(() => {
  done();
});

export default router;

import "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    title?: string; // 页面标题
    requiresAuth?: boolean; // 是否需要登录
    breadcrumb?: boolean; // 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    roles?: string[];
    affix?: boolean; // 如果设置为true，它则会固定在tags-view中(默认 false)
    // 当路由设置了该属性，则会高亮相对应的侧边栏。
    // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
    // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
    activeMenu?: string; // 当前激活的菜单
    hidden?: boolean; // 是否隐藏
    redirect?: string; //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
    // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
    // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
    // 若你想不管路由下面的 children 声明的个数都显示你的根路由
    // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
    alwaysShow?: boolean;
  }
}

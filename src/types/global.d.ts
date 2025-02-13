import type { RouteRecordSingleViewWithChildren, } from "vue-router"

declare global {
  declare type Nullable<T,> = T | null
  declare type ElRef<T extends HTMLElement = HTMLDivElement,> = Nullable<T>
  declare type ComponentRef<T,> = InstanceType<T>
  declare type Recordable<T = any, K = string,> = Record<K extends null | undefined ? string : K, T>

  declare const __APP_VERSION__: string

  declare interface UpdatePayload {
    name?: string
    task?: {
      pipelineName?: string
      pipelineTags?: string
    }
  }

  declare interface BaseFileDTO {
    /**
     * 文件名
     */
    fileName?: string
    /**
     * 文件相对路径
     */
    fileUrl?: string
    id?: number
    uid?: number
    /**
     * 文件签名下载地址
     */
    signatureUrl?: string
    /**
     * 文件类型
     */
    fileType?: string
  }

  declare interface ServerToClientEvents {
    updated: (e: UpdatePayload) => void
  }

  declare interface CustomRouteRecordRaw extends RouteRecordSingleViewWithChildren {
    id?: number
    children?: CustomRouteRecordRaw[]
  }

  declare type LayoutType = "classic" | "topLeft" | "top" | "cutMenu"

  declare interface ThemeTypes {
    elColorPrimary?: string
    leftMenuBorderColor?: string
    leftMenuBgColor?: string
    leftMenuBgLightColor?: string
    leftMenuBgActiveColor?: string
    leftMenuCollapseBgActiveColor?: string
    leftMenuTextColor?: string
    leftMenuTextActiveColor?: string
    logoTitleTextColor?: string
    logoBorderColor?: string
    topHeaderBgColor?: string
    topHeaderTextColor?: string
    topHeaderHoverColor?: string
    topToolBorderColor?: string
  }
}

declare module "vue-router" {
  interface RouteMeta {
    /**
     * 当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)
     */
    hidden?: boolean
    /**
     * 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
     * 只有一个时，会将那个子路由当做根路由显示在侧边栏，
     * 若你想不管路由下面的 children 声明的个数都显示你的根路由，
     * 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
     * 一直显示根路由(默认 false)
     */
    alwaysShow?: boolean
    /**
     * 设置该路由在侧边栏和面包屑中展示的名字
     */
    title?: string
    /**
     * 设置该路由的图标
     */
    icon?: string
    /**
     * 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
     */
    noCache?: boolean
    /**
     * 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
     */
    breadcrumb?: boolean
    /**
     * 如果设置为true，则会一直固定在tag项中(默认 false)
     */
    affix?: boolean
    /**
     * 显示高亮的路由路径
     */
    activeMenu?: string
    /**
     * 如果设置为true，则不会出现在tag中(默认 false)
     */
    noTagsView?: boolean
    /**
     * 跟随哪个路由进行权限过滤
     */
    followAuth?: string
    /**
     * 设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
     */
    canTo?: boolean
    /**
     * 国际化标题
     */
    i18n?: Record<string, string>
  }
}

export {}

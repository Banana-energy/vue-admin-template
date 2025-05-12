<script setup lang="ts">
import type { AutocompleteFetchSuggestionsCallback, } from "element-plus"
import { useI18nTitle, } from "@/hooks/useI18nTitle.ts"
import { useRouteStore, } from "@/store/Route"
import Fuse from "fuse.js"
import { computed, ref, } from "vue"

// 获取路由信息
const router = useRouter()
const routerStore = useRouteStore()
const routes = computed(() => generateRoutes(routerStore.getRouters,),)

function resolvePath(...paths: string[]) {
  const stack: string[] = []

  for (const path of paths) {
    path.split("/",).forEach((part,) => {
      if (part === "..") {
        stack.pop()
      } else if (part && part !== ".") {
        stack.push(part,)
      }
    },)
  }

  return `/${stack.join("/",)}`
}

function generateRoutes(routes: CustomRouteRecordRaw[], basePath = "/", prefixTitle: string[] = [],) {
  let res: {
    path: string
    link: string
    title: string[]
    formatTitle: string
  }[] = []
  for (const router of routes) {
    // skip hidden router
    if (router.hidden) {
      continue
    }

    const data = {
      path: resolvePath(basePath, router.path,),
      link: router.path,
      title: [...prefixTitle,],
      formatTitle: prefixTitle.join("/",),
    }

    // generate internationalized title
    const i18nTitle = useI18nTitle(router.meta,)

    if (i18nTitle) {
      data.title = [...data.title, i18nTitle,]
      data.formatTitle = data.title.join(" / ",)
    }

    if (!router.children?.length) {
      // only push the routes with title
      // special case: need to exclude parent router without redirect
      res.push(data,)
    }

    // recursive child routes
    if (router.children) {
      const tempRoutes = generateRoutes(router.children, data.path, data.title,)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes,]
      }
    }
  }
  return res
}

// 初始化 Fuse.js
const fuse = new Fuse(routes.value, {
  keys: ["formatTitle", "path",], // 允许搜索的字段
  threshold: 0.3, // 匹配敏感度（0 完全匹配，1 宽松匹配）
},)

const searchQuery = ref("",)
const searchResults = ref<{ formatTitle: string, path: string }[]>([],)

// 监听输入并搜索
function handleSearch(query: string, cb: AutocompleteFetchSuggestionsCallback,) {
  searchResults.value = query ? fuse.search(query,).map(result => result.item,) : []
  cb(searchResults.value,)
}

// 选择搜索结果跳转
function handleSelect(item: Record<string, any>,) {
  router.push(item.path,)
}
</script>

<template>
  <ElAutocomplete
    v-model="searchQuery"
    :fetch-suggestions="handleSearch"
    placeholder="Search..."
    clearable
    @select="handleSelect"
  >
    <template #default="{ item }">
      <span>{{ item.formatTitle }}</span>
    </template>
  </ElAutocomplete>
</template>

<style scoped>
.el-autocomplete {
  width: 300px;
}
</style>

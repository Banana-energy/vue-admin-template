import type { Fn, } from "@vueuse/core"
import type { RouteLocationNormalizedLoaded, } from "vue-router"
import { useTagViewStore, } from "@/store/TagView"
import { computed, nextTick, unref, } from "vue"
import { useRouter, } from "vue-router"

export function useTagView() {
  const tagsViewStore = useTagViewStore()

  const { replace, currentRoute, } = useRouter()

  const selectedTag = computed(() => tagsViewStore.getSelectedTag,)

  const closeAll = (callback?: Fn,) => {
    tagsViewStore.delAllViews()
    callback?.()
  }

  const closeLeft = (callback?: Fn,) => {
    tagsViewStore.delLeftViews(unref(selectedTag,) as RouteLocationNormalizedLoaded,)
    callback?.()
  }

  const closeRight = (callback?: Fn,) => {
    tagsViewStore.delRightViews(unref(selectedTag,) as RouteLocationNormalizedLoaded,)
    callback?.()
  }

  const closeOther = (callback?: Fn,) => {
    tagsViewStore.delOthersViews(unref(selectedTag,) as RouteLocationNormalizedLoaded,)
    callback?.()
  }

  const closeCurrent = (view?: RouteLocationNormalizedLoaded, callback?: Fn,) => {
    if (view?.meta?.affix) {
      return
    }
    tagsViewStore.delView(view || unref(currentRoute,),)

    callback?.()
  }

  const refreshPage = async(view?: RouteLocationNormalizedLoaded, callback?: Fn,) => {
    tagsViewStore.delCachedView()
    const { path, query, } = view || unref(currentRoute,)
    await nextTick()
    replace({
      path: `/redirect${path}`,
      query,
    },)
    callback?.()
  }

  const setTitle = (title: string, path?: string,) => {
    tagsViewStore.setTitle(title, path,)
  }

  return {
    closeAll,
    closeLeft,
    closeRight,
    closeOther,
    closeCurrent,
    refreshPage,
    setTitle,
  }
}

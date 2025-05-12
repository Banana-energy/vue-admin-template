<script lang="tsx">
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"
import Breadcrumb from "./Breadcrumb.vue"
import Collapse from "./Collapse.vue"
import LocaleDropdown from "./LocaleDropdown.vue"
import ScreenFull from "./ScreenFull.vue"
import SearchBar from "./SearchBar.vue"
import UserInfo from "./UserInfo.vue"

const { getPrefixCls, variables, } = useDesign()

const prefixCls = getPrefixCls("tool-header",)

export default defineComponent({
  name: "ToolHeader",
  setup() {
    const appStore = useAppStore()

    // 面包屑
    const breadcrumb = computed(() => appStore.getBreadcrumb,)

    // 折叠图标
    const hamburger = computed(() => appStore.getHamburger,)

    // 全屏图标
    const screenFull = computed(() => appStore.getScreenFull,)

    // 布局
    const layout = computed(() => appStore.getLayout,)

    // 多语言图标
    const locale = computed(() => appStore.getLocale,)
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          "h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between",
        ]}
      >
        {layout.value !== "top"
          ? (
              <div class="h-full flex items-center">
                {hamburger.value && layout.value !== "cutMenu"
                  ? (
                      <Collapse class="custom-hover" color="var(--top-header-text-color)"></Collapse>
                    )
                  : undefined}
                {breadcrumb.value ? <Breadcrumb class="<md:hidden"></Breadcrumb> : undefined}
              </div>
            )
          : undefined}
        <div class="h-full flex items-center">
          <SearchBar></SearchBar>
          {screenFull.value
            ? (
                <ScreenFull class="custom-hover" color="var(--top-header-text-color)"></ScreenFull>
              )
            : undefined}
          {locale.value
            ? (
                <LocaleDropdown
                  class="custom-hover"
                  color="var(--top-header-text-color)"
                >
                </LocaleDropdown>
              )
            : undefined}
          <UserInfo></UserInfo>
        </div>
      </div>
    )
  },
},)
</script>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-tool-header";

.#{$prefix-cls} {
  transition: left var(--transition-time-02);
}
</style>

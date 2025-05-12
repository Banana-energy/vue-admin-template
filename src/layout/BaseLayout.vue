<script lang="tsx">
import { useDesign, } from "@/hooks/useDesign"
import { useAppStore, } from "@/store/App"
import CustomerService from "./components/CustomerService.vue"
import Setting from "./components/Setting.vue"
import { useRenderLayout, } from "./components/useRenderLayout"

const { getPrefixCls, } = useDesign()

const prefixCls = getPrefixCls("layout",)

const hideSetting = computed(() => true,)

export default defineComponent({
  name: "BaseLayout",
  setup() {
    const appStore = useAppStore()

    // 是否是移动端
    const mobile = computed(() => appStore.getMobile,)

    // 菜单折叠
    const collapse = computed(() => appStore.getCollapse,)

    const layout = computed(() => appStore.getLayout,)

    function handleClickOutside() {
      appStore.setCollapse(true,)
    }

    function renderLayout() {
      const { renderClassic, renderTopLeft, renderTop, renderCutMenu, } = useRenderLayout()
      switch (unref(layout,)) {
        case "classic":
          return renderClassic()
        case "topLeft":
          return renderTopLeft()
        case "top":
          return renderTop()
        case "cutMenu":
          return renderCutMenu()
        default:
          break
      }
    }

    return () => (
      <section class={[prefixCls, `${prefixCls}__${layout.value}`, "w-full h-full relative",]}>
        {mobile.value && !collapse.value
          ? (
              <div
                class="absolute left-0 top-0 z-99 h-full w-full bg-[var(--el-color-black)] opacity-30"
                onClick={handleClickOutside}
              >
              </div>
            )
          : undefined}

        {renderLayout()}

        <CustomerService />

        {!unref(hideSetting,) && <Setting />}
      </section>
    )
  },
},)
</script>

<style lang="scss" scoped>
@use "@/styles/variables.module.scss" as *;

$prefix-cls: "#{$adminNamespace}-layout";

.#{$prefix-cls} {
  background-color: var(--app-content-bg-color);
}
</style>

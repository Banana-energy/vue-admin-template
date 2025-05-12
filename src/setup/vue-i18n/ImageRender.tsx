import type { VxeGlobalRendererHandles, } from "vxe-pc-ui"
import { ElImage, } from "element-plus"
import { get, isArray, isObject, isString, } from "lodash-es"
import { VxeUI, } from "vxe-pc-ui"

interface Props {
  imageList?: string[]
  imageStyle?: CSSStyleSheet
  wrapStyle?: CSSStyleSheet
  imageClass?: string
  wrapClass?: string
}

interface RenderOptions extends VxeGlobalRendererHandles.RenderOptions {
  props?: Props
}

VxeUI.renderer.add("Image", {
  renderTableDefault(renderOpts: RenderOptions, params: VxeGlobalRendererHandles.RenderTableDefaultParams,) {
    const { row, column, } = params
    const { props, } = renderOpts
    const style = {
      width: "60px",
      height: "60px",
    }
    const property: string | string[] | BaseFileDTO | BaseFileDTO[] = get(row, column.field,)
    let src: string | undefined
    const imageList = props?.imageList || []
    if (typeof property === "string") {
      src = property
      if (!imageList.length) {
        imageList.push(property,)
      }
    }
    if (isArray(property,)) {
      const item = property[0]
      if (isString(item,)) {
        src = item
        if (!imageList.length) {
          imageList.push(...(property as string[]),)
        }
      }
      if (isObject(item,) && "signatureUrl" in item && item.signatureUrl) {
        src = item.signatureUrl
        if (!imageList.length) {
          imageList.push(...(property as BaseFileDTO[]).map(e => e.signatureUrl!,),)
        }
      }
    }
    if (isObject(property,) && "signatureUrl" in property && property?.signatureUrl) {
      src = property.signatureUrl
      if (!imageList.length) {
        imageList.push(property.signatureUrl,)
      }
    }

    return [
      src
        ? (
            <div class={props?.wrapClass || "flex items-center justify-center"}>
              <ElImage
                src={src}
                class={props?.imageClass}
                previewSrcList={imageList}
                fit="contain"
                loading="lazy"
                previewTeleported={true}
                style={props?.imageStyle || style}
                hideOnClickModal={true}
              />
            </div>
          )
        : <span />,
    ]
  },
},)

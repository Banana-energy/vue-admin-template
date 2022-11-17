# Vue-Admin-Template

> 这是一个极简的 vue admin 管理后台。它只包含了 Element Plus & axios & permission control & lint & i18n，这些搭建后台必要的东西。

使用 [vue3](https://cn.vuejs.org/) + [pinia](https://pinia.vuejs.org/) + [tailwind](https://tailwindcss.com/docs/installation) 重写 [vue-element-admin](https://github.com/PanJiaChen/vue-admin-template)。

使用 [alibaba/kiwi](https://github.com/alibaba/kiwi) 进行多语言管理。

### 注意事项

由于 `vite-plugin-vue-setup-extend` 作者没有合并 PR，如有调试需要，可自行修改 `node_modules/vite-plugin-vue-setup-extend/dist` 中的 `index.cjs` 文件修改为如下内容：

```js
"use strict";

const compilerSfc = require("@vue/compiler-sfc");
const MagicString = require("magic-string");

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e["default"] : e;
}

const MagicString__default = /*#__PURE__*/ _interopDefaultLegacy(MagicString);

function supportScriptName(code, id) {
  let s;
  const FILENAME_RE = /.*\/(\S*)/;
  const str = () => s || (s = new MagicString__default(code));
  const { descriptor } = compilerSfc.parse(code);
  if (!descriptor.script && descriptor.scriptSetup) {
    const result = compilerSfc.compileScript(descriptor, { id });
    const name = result.attrs.name;
    const lang = result.attrs.lang;
    if (name) {
      str().appendLeft(
        0,
        `<script ${lang ? `lang="${lang}"` : ""}>
import { defineComponent } from 'vue'
export default defineComponent({
  name: '${name}',
})
<\/script>
`
      );
    }
    const map = str().generateMap({ hires: true });
    const filename = FILENAME_RE.exec(id)[1];

    map.file = filename;
    map.sources = [filename];
    return {
      map,
      code: str().toString(),
    };
  } else {
    return null;
  }
}

const index = (options = {}) => {
  return {
    name: "vite:setup-name-support",
    enforce: "pre",
    async transform(code, id) {
      if (!/\.vue$/.test(id)) {
        return null;
      }
      const { name = true } = options;
      if (name) {
        return supportScriptName.call(this, code, id);
      }
      return null;
    },
  };
};

module.exports = index;
```

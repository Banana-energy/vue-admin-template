import antfu from "@antfu/eslint-config"

export default antfu({
  vue: true,
  unocss: true,
  ignores: ["package.json", "tsconfig.json",],
  typescript: {
    overrides: {
      "ts/no-namespace": "off",
      "ts/no-empty-object-type": "off",
      "ts/consistent-type-imports": [
        "error",
        {
          fixStyle: "separate-type-imports",
          disallowTypeAnnotations: false,
        },
      ],
    },
  },
  stylistic: {
    indent: 2,
    quotes: "double",
    overrides: {
      "style/space-before-function-paren": ["error", "never",],
      "style/brace-style": ["error", "1tbs",],
      "style/comma-dangle": ["error", "always",],
    },
  },
  rules: {
    "no-console": "off",
    // 强制在单行元素的结束标签后换行
    "vue/html-closing-bracket-newline": [
      "error",
      {
        singleline: "never",
        multiline: "always",
      },
    ],
    // 强制组件定义名称使用 PascalCase
    "vue/component-definition-name-casing": ["error", "PascalCase",],
    // 强制属性名称使用连字符
    "vue/attribute-hyphenation": [
      "error",
      "always",
      {
        ignore: [],
      },
    ],
    // 强制属性顺序
    "vue/attributes-order": [
      "error",
      {
        order: [
          "DEFINITION",
          "LIST_RENDERING",
          "CONDITIONALS",
          "RENDER_MODIFIERS",
          "GLOBAL",
          ["UNIQUE", "SLOT",],
          "TWO_WAY_BINDING",
          "OTHER_DIRECTIVES",
          "ATTR_DYNAMIC",
          "ATTR_STATIC",
          "ATTR_SHORTHAND_BOOL",
          "EVENTS",
          "CONTENT",
        ],
        alphabetical: true,
      },
    ],
    // 强制事件名称使用连字符
    "vue/v-on-event-hyphenation": [
      "error",
      "always",
      {
        autofix: true,
        ignore: [],
      },
    ],
    // 强制单行元素最多包含三个属性，多行元素每行一个属性
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: {
          max: 3,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    // 强制单行 HTML 元素内容换行
    "vue/singleline-html-element-content-newline": "error",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "always",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
    "vue/component-name-in-template-casing": [
      "error",
      "PascalCase",
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ],
  },
},)

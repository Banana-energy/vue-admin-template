require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
    "plugin:vue/vue3-recommended",
    "./.eslintrc-auto-import.json",
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
    "vue/setup-compiler-macros": true,
  },
  rules: {
    "vue/no-mutating-props": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars-experimental": "off",
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "vue/attributes-order": [
      "error",
      {
        order: [
          "DEFINITION",
          "LIST_RENDERING",
          "CONDITIONALS",
          "RENDER_MODIFIERS",
          "GLOBAL",
          ["UNIQUE", "SLOT"],
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
    "vue/v-on-event-hyphenation": [
      "error",
      "always",
      {
        autofix: true,
        ignore: [],
      },
    ],
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
    "vue/singleline-html-element-content-newline": 0,
    "vue/require-default-prop": 0,
    "vue/html-closing-bracket-newline": [
      "error",
      {
        singleline: "never",
        multiline: "always",
      },
    ],
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    "vue/attribute-hyphenation": [
      "error",
      "always",
      {
        ignore: [],
      },
    ],
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "never",
          component: "always",
        },
        svg: "always",
        math: "always",
      },
    ],
    "vue/component-name-in-template-casing": [
      "error",
      "kebab-case",
      {
        registeredComponentsOnly: false,
        ignores: [],
      },
    ],
    "no-debugger": "warn",
    "vue/html-indent": 0,
    "no-fallthrough": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/multi-word-component-names": "off",
  },
};

require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
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
    "vue/max-attributes-per-line": 0,
    "vue/singleline-html-element-content-newline": 0,
    "vue/require-default-prop": 0,
    "vue/html-self-closing": [
      "warn",
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
    "vue/html-closing-bracket-newline": 0,
    "vue/html-indent": 0,
    "no-fallthrough": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/multi-word-component-names": "off",
  },
};

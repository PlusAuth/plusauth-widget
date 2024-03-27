const path = require('path')

module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: path.resolve(__dirname, "tsconfig.storybook.json"),
    sourceType: "module",
    extraFileExtensions: [".vue"]
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:storybook/recommended",
    "plugin:storybook/recommended"
  ],
  plugins: [
    "@typescript-eslint",
    "vue",
  ],
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports",
        "disallowTypeAnnotations": false
      }
    ],
    "@typescript-eslint/indent": [ "error", 2, {
      "ArrayExpression": "first",
      "FunctionDeclaration": {
        "parameters": "first"
      },
      "ImportDeclaration": 1,
      "ObjectExpression": 1,
      "SwitchCase": 1,
      "VariableDeclarator": "first"
    }],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-extra-parens": ["error"],
    "@typescript-eslint/no-unused-vars": ["warn"],
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "array-bracket-spacing": "error",
    "import/first": "error",
    "import/no-unresolved": "warn",
    "import/no-useless-path-segments": [
      "error",
      {
        "noUselessIndex": true
      }
    ],
    "import/order": [
      "error",
      {
        "newlines-between": "always-and-inside-groups",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        },
        "pathGroups": [
          {
            "pattern": "~/**",
            "group": "external"
          }
        ]
      }
    ],
    "indent": "off",
    "key-spacing": "error",
    "linebreak-style": [
      "error",
      "unix"
    ],
    "max-len": [
      "error",
      {
        "code": 100
      }
    ],

    "no-debugger": "error",
    "no-extra-parens": "off",
    "no-mixed-spaces-and-tabs": "error",
    "no-var": "error",
    "no-whitespace-before-property": "error",
    "object-curly-spacing": [
      "error",
      "always",
      {
        "arraysInObjects": true,
        "objectsInObjects": true
      }
    ],
    "prefer-template": "error",
    "quotes": [
      "error",
      "single",
      {
        "avoidEscape": true
      }
    ],
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "asyncArrow": "always",
        "named": "never"
      }
    ],
    "vue/multi-word-component-names": "off",
    "vue/no-mutating-props": "warn",
    "vue/require-default-prop": "off",
    "vue/no-v-html": "off",
    "vue/no-v-text-v-html-on-component": "off",
    'vue/valid-v-slot': ['error', {
      allowModifiers: true,
    }],
  }
};

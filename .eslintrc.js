module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true
  },
  ignorePatterns: [
    "*.html",
    "config/**",
    "dist/**",
    "*.lock",
    "*.log",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
    sourceType: "module",
    extraFileExtensions: [".vue"]
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  plugins: [
    "@typescript-eslint",
    "vue",
  ],
  rules: {
    "@typescript-eslint/ban-ts-ignore": "off",
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
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "array-bracket-spacing": "error",
    "import/first": "error",
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
        "code": 80
      }
    ],
    "no-debugger": "error",
    "no-extra-parens": "error",
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
    ]
  }
};

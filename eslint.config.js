import path from 'node:path';
import url from 'node:url';

import stylisticJs from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default tseslint.config(
  {
    ignores: [
      'storybook-static/',
      '**/*/*.min.js',
      '**/*/*.umd.js',
      '**/dist/'
    ],
  },
  {
    files: [
      '**/*.ts',
      '**/*.js',
      '**/*.vue',
      '**/*.tsx',
    ],
    plugins: {
      'import': importPlugin,
      '@typescript-eslint': tseslint.plugin,
      'unicorn': eslintPluginUnicorn,
      // @ts-ignore
      '@style': stylisticJs,
      vue: pluginVue
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        project: path.resolve(__dirname, 'tsconfig.storybook.json'),
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
        }
      }
    },
    rules: {
      ...pluginVue.configs.recommended.rules,
      '@style/array-bracket-spacing': 'error',
      '@style/indent': ['error', 2, {
        'ArrayExpression': 'first',
        'FunctionDeclaration': {
          'parameters': 'first'
        },
        'ImportDeclaration': 1,
        'ObjectExpression': 1,
        'SwitchCase': 1,
        'VariableDeclarator': 'first'
      }],
      '@style/key-spacing': 'error',
      '@style/linebreak-style': [
        'error',
        'unix'
      ],
      '@style/max-len': [
        'error',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
          ignoreRegExpLiterals: true
        }
      ],
      '@style/no-extra-parens': 'off',
      '@style/no-mixed-spaces-and-tabs': 'error',
      '@style/no-whitespace-before-property': 'error',
      '@style/object-curly-spacing': [
        'error',
        'always',
        {
          'arraysInObjects': true,
          'objectsInObjects': true
        }
      ],
      '@style/quotes': [
        'error',
        'single',
        {
          'avoidEscape': true
        }
      ],
      '@style/space-before-function-paren': [
        'error',
        {
          'anonymous': 'always',
          'asyncArrow': 'always',
          'named': 'never'
        }
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          'prefer': 'type-imports',
          'disallowTypeAnnotations': false
        }
      ],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-parens': ['error'],
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/type-annotation-spacing': 'error',
      'import/first': 'error',
      'import/no-unresolved': 'warn',
      'import/no-useless-path-segments': [
        'error',
        {
          'noUselessIndex': true
        }
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always-and-inside-groups',
          'alphabetize': {
            'order': 'asc',
            'caseInsensitive': true
          },
          'pathGroups': [
            {
              'pattern': '~/**',
              'group': 'external'
            }
          ]
        }
      ],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'warn',
      'vue/no-v-html': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'vue/require-default-prop': 'off',
      'vue/valid-v-slot': ['error', {
        allowModifiers: true,
      }]
    }
  }
)

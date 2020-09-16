import vue from 'rollup-plugin-vue'
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2'
import alias from '@rollup/plugin-alias';
import { terser } from "rollup-plugin-terser";
import { DEFAULT_EXTENSIONS } from '@babel/core';
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import purgecss from '@fullhuman/postcss-purgecss';

const extensions= [...DEFAULT_EXTENSIONS, '.ts', '.vue']

const plugins = [
    alias({
      entries: {
        'vue': 'vue/dist/vue.runtime.esm-browser.prod.js'
      }
    }),
    resolve({ extensions, browser: true}),
    commonjs(),
    vue(),

    postcss({
      minimize: true,
      plugins: [
        purgecss({
          content: [
            './src/**/*.html',
            './src/**/*.vue',
            './src/**/*.ts'
          ],
          defaultExtractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
        })
      ]
    }),
    typescript({
      include: [/\.tsx?$/, /\.vue\?.*?lang=ts/],
      useTsconfigDeclarationDir: true
    }),

    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),
  ]

if (process.env.NODE_ENV === 'development') {
  plugins.push(livereload())
  plugins.push(serve({
    historyApiFallback: true,
    contentBase: ['dev', 'dist']
  }))
}

console.log(process.env.NODE_ENV)
const name = 'PlusAuthWidget';
export default {
  input: './src/index.ts',
  external: [],

  plugins,

  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.browser,
      format: 'iife',
      name,
      globals: {},
      plugins: [
        terser()
      ]
    }
  ],
}

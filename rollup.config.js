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

const extensions= [...DEFAULT_EXTENSIONS, '.ts', '.vue']

console.log(process.env.NODE_ENV)
const name = 'PlusAuthWidget';
export default {
  input: './src/index.ts',
  external: [],

  plugins: [
    alias({
      entries: {
        'vue': 'vue/dist/vue.runtime.esm-browser.prod.js'
      }
    }),
    resolve({ extensions, browser: true}),
    commonjs(),
    vue(),

    postcss({
      minimize: true
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
  ],

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

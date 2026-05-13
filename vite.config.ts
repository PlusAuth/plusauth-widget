import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer';
import postcss_import from 'postcss-import';
import postcss_replace from 'postcss-replace';
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import helper from './helper/postcss-prefixer.js'
import pkg from './package.json';

const name = 'PlusAuthWidget';

export default defineConfig(({ command }) => ({
  server: { cors: true },
  define: {
    'process.env.NODE_ENV': JSON.stringify(command === 'build' ? 'production' : 'development'),
  },

  build: {
    target: [
      'chrome109', 'edge114', 'firefox114', 'ios14.5', 'safari11'
    ],
    lib: {
      formats: ['es', 'umd'],
      entry: resolve(__dirname, 'src/index.ts'),
      name,
      fileName: (format) => (format === 'es' ? pkg.module : pkg.main).split('/').at(1) as string,
    },
  },
  plugins: [
    UnoCSS(),
    vue({}),
    libInjectCss(),
    dts({ outDir: 'dist/types' }),
  ],
  resolve: {
    dedupe: ['vue'],
  },
}))

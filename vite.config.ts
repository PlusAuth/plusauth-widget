import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';

import { libInjectCss } from 'vite-plugin-lib-inject-css'

import pkg from './package.json' ;


const name = 'PlusAuthWidget';

export default defineConfig(({ command  }) => ({
  define: command === 'build' ? {
    'process.env': { NODE_ENV: 'production' }
  }: {},
  build: {
    target: [
      'chrome109', 'edge114', 'firefox114', 'ios14.5', 'safari11'
    ],
    lib: {
      formats: ['es', 'umd'],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name,
      // the proper extensions will be added
      fileName: (format) => (format === 'es' ? pkg.module : pkg.main).split('/').at(1) as string,
    },
  },
  plugins: [
    vue({}),
    libInjectCss(),
    dts({ outDir: 'dist/types' }),
    // checker({
    //   vueTsc: true
    // })
  ],
  resolve: {
    dedupe: ['vue'],
  },
  optimizeDeps: {
    include: [
      '@popperjs/core/lib/modifiers/offset',
      '@popperjs/core/lib/modifiers/flip',
      '@popperjs/core/lib/modifiers/preventOverflow',
      '@popperjs/core/lib/popper-lite'
    ]
  }
}))

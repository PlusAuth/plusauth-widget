import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import pkg from './package.json' ;
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css'

const name = 'PlusAuthWidget';

export default defineConfig(({ command, mode, ssrBuild }) => ({
  define: command === 'build' ? {
    'process.env': { NODE_ENV: 'production'}
  }: {},
  build: {
    target: [
      "chrome109", "edge114", "firefox114", "ios14.5", "safari11"
    ],
    lib: {
      formats: ['es', 'umd'],
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name,
      // the proper extensions will be added
      fileName: (format) => (format === 'es' ? pkg.module : pkg.main).split('/').at(1),
    },
  },
  plugins: [
    vue(),
    libInjectCss(),
    dts({ outDir: 'dist/types' }),
  ],
  resolve: {
    dedupe: ["vue"],
  },
  optimizeDeps: {
    include: [
      "@popperjs/core/lib/modifiers/offset",
      "@popperjs/core/lib/modifiers/flip",
      "@popperjs/core/lib/modifiers/preventOverflow",
      "@popperjs/core/lib/popper-lite"
    ]
  }
}))

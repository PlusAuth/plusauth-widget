import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';

import pkg from './package.json' with { type: 'json' };

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
    {
      name: 'prepend-inject-css-plugin',
      apply: 'build',
      enforce: 'post',
      generateBundle(options, bundle) {
        let cssCode = '';
        for (const [fileName, file] of Object.entries(bundle)) {
          if (fileName.endsWith('.css') && file.type === 'asset' && typeof file.source === 'string') {
            cssCode += file.source;
          }
        }
        if (!cssCode) return;

        const injectedJs = `typeof document !== "undefined" && (function(){
          var styleId = "plusauth-widget-style";
          var el = document.getElementById(styleId) || document.createElement("style");
          el.id = styleId;
          el.textContent = ${JSON.stringify(cssCode)};
          if (!el.parentNode) {
            if (document.head && document.head.firstChild) {
              document.head.insertBefore(el, document.head.firstChild);
            } else if (document.head) {
              document.head.appendChild(el);
            }
          }
        })();\n`;

        for (const file of Object.values(bundle)) {
          if (file.type === 'chunk' && file.isEntry) {
            file.code = injectedJs + file.code;
          }
        }
      }
    },
    dts({ compilerOptions: { outDir: 'dist/types' } }),
  ],
  resolve: {
    dedupe: ['vue'],
  },
}))

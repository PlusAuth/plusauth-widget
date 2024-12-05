import autoprefixer from 'autoprefixer';
import postcss_import from 'postcss-import';

import postcss_replace from 'postcss-replace';
import tailwindcss0 from 'tailwindcss';
import tailwindcss from 'tailwindcss/nesting/index.js';

import helper from './helper/postcss-prefixer.js';

/** @type {import("postcss-load-config").Config} */
export default () => ({
  minimize: process.env.NODE_ENV === 'production',
  plugins: [
    helper({
      prefix: 'pa__',
      ignore: [/sb-?/],
      ignoreFiles: [
        /\.storybook/, 'index\.html'
      ]
    }),
    postcss_import(),
    tailwindcss,
    tailwindcss0(),
    autoprefixer(),
    postcss_replace({
      pattern: /(--tw-)/g,
      data: {
        'replaceAll': '--pa-', // Prefixing
      }
    }),
  ]
})

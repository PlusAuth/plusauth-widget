import autoprefixer from 'autoprefixer';
import postcss_import from 'postcss-import';
import postcss_nested from 'postcss-nested';
import postcss_replace from 'postcss-replace';
import unocss from '@unocss/postcss';

import helper from './helper/postcss-prefixer.js';

/** @type {import("postcss-load-config").Config} */
export default () => ({
  minimize: process.env.NODE_ENV === 'production',
  plugins: [
    postcss_import(),
    postcss_nested(),
    unocss(),
    autoprefixer(),
    helper({
      prefix: 'pa__',
      ignore: [/sb-?/],
      ignoreFiles: [
        /\.storybook/, 'index\.html'
      ]
    }),
    postcss_replace({
      pattern: /(--un-)/g,
      data: {
        'replaceAll': '--pa-', // Prefixing
      }
    }),
  ]
})

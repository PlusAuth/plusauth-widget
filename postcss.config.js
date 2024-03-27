/** @type {import("postcss-load-config").Config} */
import helper from "./helper/postcss-prefixer.js";

import postcss_import from "postcss-import";

import tailwindcss from "tailwindcss/nesting/index.js";

import tailwindcss0 from "tailwindcss";

import autoprefixer from "autoprefixer";

import postcss_replace from "postcss-replace";

export default () => ({
  minimize: process.env.NODE_ENV === 'production',
  plugins: [
    helper({
      prefix: 'pa__',
      ignore: [/sb-?/],
      ignoreFiles: [
        /\.storybook/
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

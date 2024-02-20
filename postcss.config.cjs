/** @type {import("postcss-load-config").Config} */
module.exports = () => ({
  minimize: process.env.NODE_ENV === 'production',
  plugins: [
    require("./helper/postcss-prefixer.js").default({
      prefix: 'pa__',
      ignore: [/sb-?/],
      ignoreFiles: [
        'hide-control'
      ]
    }),
    require('postcss-import')(),
    require('tailwindcss/nesting'),
    require('tailwindcss')(),
    require('autoprefixer')(),
    require('postcss-replace')({
      pattern: /(--tw-)/g,
      data: {
        'replaceAll': '--pa-', // Prefixing
      }
    }),
  ]
})

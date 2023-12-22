/** @type {import("postcss-load-config").Config} */
export default () => ({
  minimize: process.env.NODE_ENV === 'production',
  plugins: {
    'postcss-prefixer': {
      prefix: 'pa__'
    },
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-replace': {
      pattern: /(--tw-)/g,
      data: {
        'replaceAll': '--pa-', // Prefixing
      }
    }
  }
})

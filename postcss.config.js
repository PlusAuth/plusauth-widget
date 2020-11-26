const purgecss = require('@fullhuman/postcss-purgecss');
const postcssPrefixer = require('postcss-prefixer');
const autoprefixer = require('autoprefixer')

module.exports = {
  minimize: process.env.NODE_ENV === "production",
  // extract: 'plusauth-widget.css',
  plugins: [
    postcssPrefixer({
      prefix: 'pa__'
    }),
    autoprefixer,
    ...process.env.NODE_ENV === "production" ? [
        purgecss({
          content: [
            './src/**/*.html',
            './src/**/*.vue',
            './src/**/*.ts'
          ],
          safelist: {
            greedy: [
              /^pa__primary--/,
              /^pa__secondary--/,
              /^pa__error--/,
              /^pa__warning--/,
              /^pa__success--/,
              /^pa__info--/,
            ]
          },
          defaultExtractor: content => {
            //  `pa-(screen-1.5)`
            const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []

            // .container(class="w-1/2")
            const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []

            return broadMatches.concat(innerMatches)
          }
        })
      ]
      : []

  ]
}

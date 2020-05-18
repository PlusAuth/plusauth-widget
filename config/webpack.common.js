const path = require('path')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader')

const autoprefixer = require('autoprefixer');

module.exports = {
  entry: [
    path.resolve(__dirname, '../src/index.ts')
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue': '@vue/runtime-dom'
    }
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    library: "PlusAuthWidget",
    libraryTarget: "umd",
    libraryExport: "default",
    umdNamedDefine: true,
    publicPath: '/',
  },

  plugins: [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },

      /**
       * Styles
       *
       * Inject CSS into the head with source maps.
       */
      {
        test: /\.(sass|scss|css)/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: require.resolve('postcss-loader'),
            options: {
              plugins: () => [
                // prefixer({
                //     prefix: '.__pa_widget'
                // }),
                autoprefixer()
              ]
            }
          },
          'sass-loader'
        ]
      },
    ],
  },
}

const path = require('path')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')

const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: "plusauthkit.min.js",
  },
  plugins: [
  ],
  module: {
    rules: [
    ],
  },

  /**
   * Optimization
   *
   * Production minimizing of JavaSvript and CSS assets.
   */
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({
      terserOptions:{
        ecma: 5,
        safari10: true,
        ie8: true
      }
    })]
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
})

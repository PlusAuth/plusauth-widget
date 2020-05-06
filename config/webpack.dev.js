const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')

const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = require('./webpack.common')


module.exports = merge(common, {

  mode: 'development',

  devtool: 'cheap-module-source-map',

  devServer: {
    port: 8088,
    historyApiFallback: true,
    clientLogLevel: 'warn',
    disableHostCheck: true,
    hot: true,
    stats: 'minimal',
    writeToDisk: true,
    contentBase: path.resolve(__dirname, '../public'),
    overlay: true,
    https: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "public/template.html",
      inject: false,
      cache: false,
    }),

  ],
})

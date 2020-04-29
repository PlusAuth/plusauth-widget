/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require("fs");

const autoprefixer = require('autoprefixer');
const prefixer = require('postcss-prefix-selector');
const { VueLoaderPlugin } = require('vue-loader')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env = {}) => ({
  mode: env.prod ? 'production' : 'development',
  devtool: env.prod ? 'source-map' : 'cheap-module-source-map',
  entry: path.resolve(__dirname, '../src/index.ts'),
  output: {
    library: "PlusAuthKit",
    libraryTarget: "umd",
    libraryExport: "default",
    path: path.resolve(__dirname, "../dist"),
    filename: "plusauthkit.min.js",
    umdNamedDefine: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue': '@vue/runtime-dom'
    }
  },
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
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 }
        }
      },
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

    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "public/template.html",
      inject: false,
      cache: false,
    }),
    new CleanWebpackPlugin()
  ],
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
  }
})

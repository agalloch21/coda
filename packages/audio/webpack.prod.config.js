const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new UglifyJsPlugin({
      sourceMap: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ],
  devtool: 'source-map',
  externals: {
    '@most/core': {
      commonjs: '@most/core',
      commonjs2: '@most/core',
      amd: '@most/core',
      root: '@most/core',
    },
    '@most/scheduler': {
      commonjs: '@most/scheduler',
      commonjs2: '@most/scheduler',
      amd: '@most/scheduler',
      root: '@most/scheduler',
    },
  },
});
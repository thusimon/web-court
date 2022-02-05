const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getBuildFilePathAndName, htmlWebpackPlugins, copyWebpackPlugin, miniCssExtractPluginForPages } = require('./tools/build-utils');

const config = {
  mode: 'production',
  devtool: false,
  entry: {
    background: './src/background',
    script: './src/content/script',
    options: './src/pages/options/options',
    features: './src/pages/features/features',
    popover: './src/pages/popover/popover'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: (pathData) => getBuildFilePathAndName(pathData.chunk.name),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  experiments: {
    topLevelAwait: true
  }
};

config.plugins = [...htmlWebpackPlugins, copyWebpackPlugin, miniCssExtractPluginForPages];

config.optimization = {
  minimizer: [
    `...`,
    new CssMinimizerPlugin(),
  ],
};

module.exports = config;

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getBuildFilePathAndName, htmlWebpackPlugins, copyWebpackPlugin, miniCssExtractPluginForPages } = require('./tools/build-utils');

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    background: './src/background.ts',
    script: './src/content/script.ts',
    options: './src/pages/options/options.ts',
    features: './src/pages/features/features.tsx',
    popover: './src/pages/popover/popover.ts'
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

module.exports = config;

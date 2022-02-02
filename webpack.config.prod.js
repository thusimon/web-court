const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getBuildFilePathAndName, htmlWebpackPlugins, copyWebpackPlugin, miniCssExtractPluginForPages } = require('./tools/build-utils');

const config = {
  mode: 'production',
  devtool: false,
  entry: {
    background: './src/background.ts',
    script: './src/content/script.ts',
    options: './src/pages/options/options.ts',
    features: './src/pages/features/features.ts',
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
        test: /\.ts$/,
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
    extensions: ['.ts', '.js']
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

const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { getBuildFilePathAndName, htmlWebpackPlugins, copyWebpackPlugin } = require('./tools/build-utils');

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
        test: /(?!\.spec)\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
              sassOptions: {
                outputStyle: "compressed",
              },
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  experiments: {
    topLevelAwait: true
  }
};

config.plugins = [...htmlWebpackPlugins, copyWebpackPlugin];

config.optimization = {
  minimizer: [
    `...`,
    new CssMinimizerPlugin(),
  ],
};

module.exports = config;

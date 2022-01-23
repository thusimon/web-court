const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getBuildFilePathAndName, getHtmlFilePathAndName } = require('./tools/build-utils');

const config = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: {
    background: './src/background.ts',
    script: './src/content/script.ts',
    options: './src/pages/options.ts'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: (pathData) => getBuildFilePathAndName(pathData.chunk.name),
    clean: true
  }
};

const htmlPluginConfig = [
  {
    chunk: 'options',
    filePath: 'pages/options'
  }
];

const htmlPlugins = htmlPluginConfig.map(config => new HtmlWebpackPlugin({
  chunks: [config.chunk],
  title: config.chunk,
  filename: `${config.filePath}.html`,
  inject: 'body'
}));

config.plugins = [].concat(htmlPlugins);

module.exports = config;

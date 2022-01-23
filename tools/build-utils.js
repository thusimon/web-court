const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getBuildFilePathAndName = (chunkName) => {
  switch (chunkName) {
    case 'background':
      return 'background.js';
    case 'script':
      return 'content/script.js';
    case 'options':
      return 'pages/options/options.js';
    case 'popover':
      return 'pages/popover/popover.js';
    default:
      return 'bundle.js';
  }
};

const pageChunks = [
  {
    chunk: 'options',
    filePath: 'pages/options/options'
  },
  {
    chunk: 'popover',
    filePath: 'pages/popover/popover'
  }
];

const htmlWebpackPlugins = pageChunks.map(config => new HtmlWebpackPlugin({
  chunks: [config.chunk],
  title: config.chunk,
  filename: `${config.filePath}.html`,
  inject: 'body'
}));

const miniCssExtractPluginForPages = new MiniCssExtractPlugin({
  filename: ({ chunk }) => `pages/${chunk.name}/${chunk.name}.css`
});

const copyWebpackPlugin = new CopyWebpackPlugin({
  patterns: [
    {
      from: './src/manifest.json'
    },
    {
      from: './src/content/style.css',
      to: './content'
    },
    {
      from: './src/assets',
      to: './assets'
    }
  ]
});

module.exports = {
  getBuildFilePathAndName,
  htmlWebpackPlugins,
  copyWebpackPlugin,
  miniCssExtractPluginForPages
};

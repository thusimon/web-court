const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const getBuildFilePathAndName = (chunkName) => {
  switch (chunkName) {
    case 'background':
      return 'background.js';
    case 'script':
      return 'content/script.js';
    case 'options':
      return 'pages/options/options.js';
    case 'features':
      return 'pages/features/features.js';
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
    chunk: 'features',
    filePath: 'pages/features/features'
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
  template: './src/pages/template.html',
  inject: 'body'
}));

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
  copyWebpackPlugin
};

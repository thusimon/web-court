const fsp = require('fs/promises');
const path = require('path');
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

const copyCommon = [
  {
    from: './src/content/style.css',
    to: './content'
  },
  {
    from: './src/assets',
    to: './assets'
  },
];

const copyChromeManifset = {
  from: './src/manifest_chrome.json',
  to: './manifest.json'
};

const copyFirefoxManifest = {
  from: './src/manifest_firefox.json',
  to: './manifest.json'
};

const getCopyConfigs = (browser, model) => {
  const copyManifest = browser === 'chrome' ? copyChromeManifset : copyFirefoxManifest;
  const copyModel =  {
    from: `./tf/yolo/tfjs-models/${model}`,
    to: `./model/${model}`
  }
  return new CopyWebpackPlugin({
    patterns: [
      copyManifest,
      copyModel,
      ...copyCommon
    ]
  });
}


const copyWebpackPluginChrome = new CopyWebpackPlugin({
  patterns: [
    {
      from: './src/manifest_chrome.json',
      to: './manifest.json'
    },
    ...copyCommon
  ]
});

const copyWebpackPluginFirefox = new CopyWebpackPlugin({
  patterns: [
    {
      from: './src/manifest_firefox.json',
      to: './manifest.json'
    },
    ...copyCommon
  ]
});

const sassProdRule = {
  test: /\.s[ac]ss$/i,
  use: [
    // Creates `style` nodes from JS strings
    'style-loader',
    // Translates CSS into CommonJS
    'css-loader',
    // Compiles Sass to CSS
    'sass-loader'
  ]
};

const sassDevRule = {
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
};

const getWebpackConfig = (browser, prod, model) => {
  const config = {
    mode: prod ? 'production' : 'development',
    devtool: prod ? false : 'inline-source-map',
    entry: {
      background: './src/background',
      script: './src/content/script',
      options: './src/pages/options/options',
      features: './src/pages/features/features',
      popover: './src/pages/popover/popover'
    },
    output: {
      path: path.resolve(__dirname, `./dist/${browser}`),
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
        prod ? sassProdRule : sassDevRule
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    experiments: {
      topLevelAwait: true
    }
  };
  
  const copyWebpackPlugin = getCopyConfigs(browser, model);
  config.plugins = [...htmlWebpackPlugins, copyWebpackPlugin];
  return config;
};

const copyFolder = async (src, dest) => {
  await fsp.cp(src, dest, { recursive: true });
};

module.exports = {
  getWebpackConfig,
  copyFolder
};

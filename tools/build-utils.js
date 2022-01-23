const getBuildFilePathAndName = (chunkName) => {
  if (chunkName === 'background') {
    return 'background.js';
  } else if (chunkName === 'script') {
    return 'content/script.js';
  } else if (chunkName === 'options') {
    return 'pages/options.js';
  } else {
    return 'bundle.js';
  }
};

const getHtmlFilePathAndName = (entry) => {
  if (entry === 'options') {
    return 'pages/options.html';
  } else {
    return 'index.html';
  }
}

module.exports = {
  getBuildFilePathAndName,
  getHtmlFilePathAndName,
};

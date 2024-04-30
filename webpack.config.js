const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { getWebpackConfig } = require('./tools/build-utils');

const argv = yargs(hideBin(process.argv)).argv

const {browser, build, model} = argv;

if (!browser || !build || !model) {
  throw 'wrong arguments, e.g --browser=chrome --build=dev --model=yolo8m';
}

module.exports = getWebpackConfig(browser, build==='prod', model);

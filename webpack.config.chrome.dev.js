const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { getWebpackConfig } = require('./tools/build-utils');

const argv = yargs(hideBin(process.argv)).argv

const buildArgs = yargs(argv._).argv;

const {browser, build, model} = buildArgs;

if (!browser || !build || !model) {
  throw 'wrong arguments, e.g --browser=chrome --build=dev --model=yolo8m';
}

module.exports = getWebpackConfig(browser, build==='prod', model);

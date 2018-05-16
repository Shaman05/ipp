//config of app

const os = require('os');
const path = require('path');
const fs = require('fs');
const pkg = require('../package');
let processCwd = process.cwd();
let resourcesDir = path.join(__dirname, 'resources');

module.exports = {
  pkg,
  frame: {
    width: 800,
	height: 600
  },
  icons: {
    png48: resourcesFile('ZIP_48x48.png'),
    png128: resourcesFile('ZIP_128x128.png'),
	ico48: resourcesFile('ZIP_48x48.ico'),
	ico128: resourcesFile('ZIP_128x128.ico'),
  }
};

function resourcesFile(name) {
  return path.join(resourcesDir, name);
}
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
	entry: path.join(__dirname, 'index.html'),
	consolePage: path.join(__dirname, 'console.html'),
	icons: {
		png48: resourcesFile('logo-48x48.png'),
		png128: resourcesFile('logo-128x128.png'),
		ico48: resourcesFile('logo-48x48.ico'),
		ico128: resourcesFile('logo-128x128.ico'),
	},
	debug: false,
	storage: path.join(processCwd, 'repos.json')
};

function resourcesFile(name) {
	return path.join(resourcesDir, name);
}
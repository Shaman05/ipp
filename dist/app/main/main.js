/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {//config of app

const os = __webpack_require__(6);
const path = __webpack_require__(1);
const fs = __webpack_require__(7);
const pkg = __webpack_require__(8);
let processCwd = process.cwd();
let resourcesDir = path.join(__dirname, 'resources');

module.exports = {
	pkg,
	frame: {
		width: 800,
		height: 600
	},
	entry: path.join(__dirname, 'index.html'),
	icons: {
		png48: resourcesFile('ZIP_48x48.png'),
		png128: resourcesFile('ZIP_128x128.png'),
		ico48: resourcesFile('ZIP_48x48.ico'),
		ico128: resourcesFile('ZIP_128x128.ico'),
	},
	debug: false,
	storage: path.join(processCwd, 'repos.json')
};

function resourcesFile(name) {
	return path.join(resourcesDir, name);
}
/* WEBPACK VAR INJECTION */}.call(exports, "app"))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const {app, BrowserWindow} = __webpack_require__(0);
const path = __webpack_require__(1);
const url = __webpack_require__(4);
let menu = __webpack_require__(5);
let config = __webpack_require__(2);

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win;

function createWindow() {
	let {entry, frame, debug} = config;
	debug = process.argv[2] === 'debug' || debug;
	console.log(`index page: ${entry}`);
	
	// 创建浏览器窗口。
	let {width, height} = frame;
	win = new BrowserWindow({
		width, height,
		icon: config.icons.png48,
		resizable: false
	});
	menu.init(win, debug);
	
	// 然后加载应用的 index.html。
	win.loadURL(url.format({
		pathname: entry,
		protocol: 'file:',
		slashes: true
	}));
	
	// 打开开发者工具。
	debug && win.webContents.openDevTools();
	
	// 当 window 被关闭，这个事件会被触发。
	win.on('closed', () => {
		// 取消引用 window 对象，如果你的应用支持多窗口的话，
		// 通常会把多个 window 对象存放在一个数组里面，
		// 与此同时，你应该删除相应的元素。
		win = null
	})
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
	// 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
	// 否则绝大部分应用及其菜单栏会保持激活。
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	// 在macOS上，当单击dock图标并且没有其他窗口打开时，
	// 通常在应用程序中重新创建一个窗口。
	if (win === null) {
		createWindow()
	}
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

//创建应用菜单

const electron = __webpack_require__(0);
const {Menu, shell, dialog} = electron;
let config = __webpack_require__(2);
let {pkg, icons} = config;

module.exports = {
	init(win, debug){
		const template = [
			{
				label: 'Open',
				submenu: [
					{
						label: 'Repository',
						accelerator: 'CmdOrCtrl+O',
						click(){
							//todo: open dir
						}
					},
					{type: 'separator'},
					{
						label: 'Exit',
						role: 'close'
					}
				]
			},
			{
				label: 'Tools',
				submenu: [
					{
						label: 'Hash File',
						click(){
							//todo:
						}
					}
				]
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'Learn More',
						accelerator: 'CmdOrCtrl+H',
						click(){
							shell.openExternal('https://github.com/Shaman05/ipp');
						}
					},
					{
						label: 'About',
						click(){
							let msg = [
								`关于增量打包程序`,
								`版本: ${pkg.version}`,
								`作者: ${pkg.author}`,
								`由 Electron + Vue + Webpack 驱动.`
							];
							dialog.showMessageBox(win, {
								type: 'info',
								icon: icons.png48,
								title: `About ${pkg.name}`,
								message: msg.join('\n'),
								buttons: ['OK']
							});
						}
					}
				]
			}
		];
		
		if (process.platform === 'darwin') {
		
		}
		
		if(debug){
			template.push({
				label: 'Debug',
				submenu: [
					{role: 'reload'},
					{role: 'forcereload'},
					{role: 'toggledevtools'},
					{type: 'separator'},
					{role: 'resetzoom'},
					{role: 'zoomin'},
					{role: 'zoomout'},
					{type: 'separator'},
					{role: 'togglefullscreen'}
				]
			});
		}
		
		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	}
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {"name":"ipp","version":"1.0.0","description":"Incremental package publisher.","main":"app/main/main.js","scripts":{"dev":"E:/electron-v2.0.0-win32-ia32/electron.exe .","prd":"cd dist && E:/electron-v2.0.0-win32-ia32/electron.exe ."},"repository":{"type":"git","url":"git+https://github.com/Shaman05/ipp.git"},"author":"shaman<https://github.com/Shaman05>","license":"ISC","bugs":{"url":"https://github.com/Shaman05/ipp/issues"},"homepage":"https://github.com/Shaman05/ipp#readme","dependencies":{"iview":"^2.14.0-rc.1","simple-git":"^1.92.0","vue":"^2.5.16","vue-router":"^3.0.1"}}

/***/ })
/******/ ]);
/**
 * Created by ChenChao on 2018/5/8.
 * 串口窗口主进程
 */

const {BrowserWindow} = require('electron');
const Conf = require('../config');
let debug = process.argv[2] === 'debug' || Conf.devTools;

module.exports = {
	isConsoleOpen: false,
	win: null,
	handler(action, event, message) {
		console.log('[XBuild console window]:', message);
		if (action === 'open') {
			return this.openWindow();
		}
		if (action === 'close') {
			return this.closeWindow();
		}
		if (action === 'print'){
			this.win && this.win.webContents.send('print', message);
		}
	},
	openWindow() {
		if (this.isConsoleOpen) {
			if (this.win) {
				this.win.focus();
			}
			return console.log(`输出信息窗口已打开，请先关闭已有的窗口后再重新尝试新开窗口！`);
		}
		let winWidth = Conf.frame.width - 100;
		let winHeight = Conf.frame.height - 50;
		let win = this.win = new BrowserWindow({
			width: winWidth,
			height: winHeight,
			minWidth: winWidth,
			minHeight: winHeight,
			icon: Conf.icons.png48,
			transparent: false,
			frame: false,
			resizable: true,
			show: false,
			//modal: true,
			//parent: mainWindow
		});
		win.on('closed', () => {
			win = this.win = null;
		});
		win.once('ready-to-show', () => {
			win.show();
		});
		win.loadURL(Conf.consolePage);
		debug && win.webContents.openDevTools();
		this.isConsoleOpen = true;
	},
	closeWindow() {
		if (this.isConsoleOpen) {
			this.win && this.win.close();
		}
		this.isConsoleOpen = false;
	}
};
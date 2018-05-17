/**
 * Created by ChenChao on 2018/5/16.
 */

const path = require('path');
const fs = require('fs');
const {shell, ipcRenderer, remote} = require('electron');
let {storage} = require('../../config');

module.exports = {
	getComponentTpl(name) {
		let tplFile = path.resolve(__dirname, `../components/${name}/tpl.html`);
		return fs.readFileSync(tplFile, 'utf-8');
	},
	selectDir: function (options) {
		let dialog = remote.dialog;
		dialog.showOpenDialog({
			title: options.title || 'please select a directory',
			properties: ['openDirectory']
		}, function (filenames) {
			if (filenames) {
				options.onSelect && options.onSelect(filenames[0]);
			} else {
				options.onCancel && options.onCancel();
			}
		});
	},
	getStorage(){
		try{
			return require(`${storage}`);
		}catch (e){
			console.warn(`[getStorage]: require storage error!`);
			return {};
		}
	},
	updateRepo(name, dir, callback){
		let storageDate = this.getStorage();
		let repos = storageDate.repos || {};
		let time = new Date();
		repos[name] = {
			name, dir,
			timestamp: time.getTime(),
			open: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
		};
		storageDate.repos = repos;
		fs.writeFile(storage, JSON.stringify(storageDate, true, 2), (err)=>{
			callback && callback(err);
		});
	},
	parsePath(_path){
		return path.parse(_path);
	}
};
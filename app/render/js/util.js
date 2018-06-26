/**
 * Created by ChenChao on 2018/5/16.
 */

const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const BufferHelper = require('bufferhelper');
const {spawn, exec} = require('child_process');
const {shell, ipcRenderer, remote} = require('electron');
let {storage} = require('../../config');

module.exports = {
	getComponentTpl(name){
		let tplFile = path.resolve(__dirname, `../components/${name}/tpl.html`);
		return fs.readFileSync(tplFile, 'utf-8');
	},
	openPath(path){
		shell.openItem(path);
	},
	selectDir(options){
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
	updateRepo(params, callback){
		let {action, name, dir} = params;
		let storageDate = this.getStorage();
		let repos = storageDate.repos || {};
		let time = new Date();
		if(action === 'add'){
			repos[name] = {
				name, dir,
				timestamp: time.getTime(),
				open: `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`
			};
		}
		if(action === 'delete'){
			delete repos[name];
		}
		storageDate.repos = repos;
		fs.writeFile(storage, JSON.stringify(storageDate, true, 2), (err)=>{
			callback && callback(err);
		});
	},
	removeRepo(name, callback){
		let title = '移除仓库';
		module.exports.updateRepo({
			action: 'delete',
			name
		}, (err)=>{
			if(err){
				this.$Notice.error({title, desc: `移除失败，原因：<br/>${err}!`});
			}else{
				this.$Notice.success({title: `已移除：${name}!`});
				callback && callback();
			}
		});
	},
	objectToArray(object, sortBy){
		let tempArray = [];
		for(let key in object){
			if(object.hasOwnProperty(key)){
				tempArray.push(object[key]);
			}
		}
		tempArray.sort((a, b)=>{
			return a[sortBy] < b[sortBy];
		});
		return tempArray;
	},
	parsePath(_path){
		return path.parse(_path);
	},
	
	runCommand(command, cwd, callbacks){
		let fullCommand = spawn(`node`, command, {
			cwd
		});
		let onData = callbacks.onData || function (data) {};
		let onError = callbacks.onError || function (data) {};
		let onEnd = callbacks.onEnd || function (code) {};
		let groupTitle = `===== "node ${command.join(' ')}" =====`;
		console.group(groupTitle);
		fullCommand.stdout.on('data', (data) => {
			let buffer = new BufferHelper();
			buffer = buffer.concat(data);
			let str = iconv.decode(buffer.toBuffer(), 'utf8');
			onData && onData(str);
		});
		
		fullCommand.stderr.on('data', (data) => {
			let buffer = new BufferHelper();
			buffer = buffer.concat(data);
			let str = iconv.decode(buffer.toBuffer(), 'utf8');
			onError && onError(str);
		});
		
		fullCommand.on('close', (code) => {
			onEnd && onEnd(code);
			console.groupEnd(groupTitle);
		});
	},
	
	sendCommand(action, message){
		ipcRenderer.send(action, message);
	}
};
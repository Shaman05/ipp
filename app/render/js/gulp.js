/**
 * Created by ChenChao on 2018/5/16.
 */

const path = require('path');
const fs = require('fs');
const util = require('./util');

function Gulp(dir, options){
	this.rootDir = dir;
	this.options = options;
	this.tasks = [];
	return this;
}

Gulp.prototype = {
	init(){
		this.initGulpShell();
	},
	initGulpShell(){
		let localGulp = path.join(this.rootDir, 'node_modules', 'gulp', 'bin', 'gulp.js');
		let that = this;
		this.gulpCommand = `${localGulp}`;
		util.runCommand([`${localGulp}`, `-v`], this.rootDir, {
			onClose(code){
				if(code !== 0){
					console.warn(`[gulp check] 本地gulp检测失败！`);
					//如果检测失败，将使用全局gulp
					that.gulpCommand = `gulp`;
				}
				that.tasks = that.getTasks();
			}
		});
	},
	getTasks(){
		let task = [];
		let content = fs.readFileSync(path.join(this.rootDir, 'gulpfile.js'), 'utf-8');
		let re = /gulp\.task.*?\(.*?['|"](.*?)['|"]/ig;
		let result = '';
		while (result = re.exec(content)) {
			task.push({
				name: result[1],
				command: `${this.gulpCommand} ${result[1]}`
			});
		}
		task.sort(function (v1, v2) {
			return v1.name < v2.name ? -1 : 1;
		});
		return task;
	},
	runTaskByName(taskName, params, callbacks){
		let taskCommand = '';
		this.tasks.forEach((task, index)=> {
			let {name, command} = task;
			if(name === taskName){
				taskCommand = taskName;
			}
		});
		let command = [this.gulpCommand, taskCommand];
		if(params){
			command = command.concat(params);
		}
		taskCommand && util.runCommand(command, this.rootDir, callbacks || {});
	}
};

module.exports = Gulp;
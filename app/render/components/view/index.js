/**
 * Created by ChenChao on 2018/5/16.
 */

const Path = require('path');
const Fs = require('fs');
const Git = require('../../js/git');
const Gulp = require('../../js/gulp');
const Vue = require('vue/dist/vue');

module.exports = function (components, template, config, util) {
	return Vue.extend({
		template,
		data() {
			return {
				tab: 'info',
				isCollapsed: false,
				repoName: '',
				repoDir: '',
				filterKey: '',
				logs: [],
				displayLogs: [],
				latestLog: {},
				logsReady: false,
				pageSize: 20,
				buildArray: [],
				hashResult: null,
				runStatus: {
					action: '',
					isRunning: false
				},
				spikeZipDir: '',
				packagerDir: '',
			}
		},
		computed: {
			menuItemClasses() {
				return ['menu-item', this.isCollapsed ? 'collapsed-menu' : ''];
			},
			betweenVersion() {
				let buildArray = this.buildArray;
				let len = this.buildArray.length;
				let data = {
					from: buildArray[len - 1] || {},
					to: buildArray[len - 2] || {}
				};
				let fromHash = data.from.hash && data.from.hash.substr(0, 7) || '';
				let toHash = data.to.hash && data.to.hash.substr(0, 7) || '';
				return {
					fromMsg: data.from.message,
					fromHash,
					toMsg: data.to.message,
					toHash
				}
			}
		},
		created(){
			let {name, dir} = this.$route.params;
			this.repoName = name;
			this.repoDir = dir;
			this.git = new Git(dir);
			this.openRepo();
			this.gulp = new Gulp(dir, {});
			this.gulp.initGulpShell();
			let localConfig = util.getLocalConfig(name);
			let {spikeZipDir, packagerDir} = localConfig;
			if(spikeZipDir){
				this.spikeZipDir = spikeZipDir;
			}
			if(packagerDir){
				this.packagerDir = packagerDir;
			}
		},
		methods: {
			selectMenu(name){
				if(name === 'back'){
					history.back();
				}
				if(name === 'info'){
					this.hashResult = null;
					this.openRepo();
				}
				if(name === 'build'){
					this.tab = 'build';
					//let tasks = this.gulp.getTasks();
				}
			},
			openRepo(){
				this.tab = 'info';
				this.git.getLogs((err, result)=>{
					console.log(result);
					this.logs = result.all;
					this.latestLog = result.latest;
					this.logsReady = true;
					this.showLogs(-1);
				});
			},
			refreshLogs(){
				this.logsReady = false;
				this.openRepo();
			},
			showLogs(page){
				let startIndex = page * this.pageSize;
				if(page === -1){
					return this.displayLogs = this.logs;
				}
				this.displayLogs = this.logs.slice(startIndex, this.pageSize);
			},
			addLog(log){
				this.buildArray.push(log);
				if(this.canBuild()){
					this.selectMenu('build');
				}
			},
			canClear(){
				return !!this.betweenVersion.fromHash || !!this.betweenVersion.toHash;
			},
			canBuild() {
				return !!this.betweenVersion.fromHash && !!this.betweenVersion.toHash && !!this.spikeZipDir;
			},
			resetVersions(){
				this.buildArray = [{}, {}];
			},
			beforeRun(action, next) {
				if(this.runStatus.isRunning){
					return this.$Notice.error({title: `请等待正在运行的任务结束！`});
				}
				this.runStatus = { action, isRunning: true };
				util.sendCommand('open console');
				next();
			},
			build(){
				let self = this;
				this.beforeRun('build', ()=>{
					let {fromHash, toHash} = this.betweenVersion;
					util.sendCommand('print', `<div class="end-line warn">zip:changes --v1=${fromHash} --v2=${toHash}</div>`);
					this.gulp.runTaskByName('zip:changes', [`--v1=${fromHash}`, `--v2=${toHash}`], {
						onData(data){
							util.sendCommand('print', data);
						},
						onError(data){
							util.sendCommand('print', data);
						},
						onEnd(code){
							self.runStatus = { action: '', isRunning: false };
							util.sendCommand('print', `<div class="end-line ${code === 0 ? 'success' : 'error'}">Exit with code: ${code}</div>`);
						}
					});
				});
			},
			construct(){
				let self = this;
				this.beforeRun('construct', ()=> {
					this.gulp.runTaskByName('build', [`--out=${this.packagerDir}`], {
						onData(data){
							util.sendCommand('print', data);
						},
						onError(data){
							util.sendCommand('print', data);
						},
						onEnd(code){
							self.runStatus = { action: '', isRunning: false };
							util.sendCommand('print', `<div class="end-line ${code === 0 ? 'success' : 'error'}">Exit with code: ${code}</div>`);
						}
					});
				});
			},
			publish(){
				let NSisScriptPath = Path.join(this.packagerDir, 'XBlockly-win32-x64', 'nsis-xblockly');
				console.log(NSisScriptPath);
				try{
					Fs.statSync(NSisScriptPath);
					util.openPath(NSisScriptPath);
				}catch (e){
					return this.$Notice.error({
						title: '打开发布脚本目录失败！',
						desc: `原因：<br/>${e}!`});
				}
			},
			selectSpikeZipDir(){
				let that = this;
				util.selectDir({
					title: '请选择增量包的输出位置',
					onSelect(dir){
						that.spikeZipDir = dir;
						util.setConfig(that.repoName, 'spikeZipDir', dir);
					}
				});
			},
			selectPackagerDir(){
				let that = this;
				util.selectDir({
					title: '请选择构建源码的输出位置',
					onSelect(dir){
						that.packagerDir = dir;
						util.setConfig(that.repoName, 'packagerDir', dir);
					}
				});
			},
			openSpikeDir(){
				if(this.spikeZipDir){
					util.openPath(this.spikeZipDir);
				}
			},
			openPackagerDir(){
				if(this.packagerDir){
					util.openPath(this.packagerDir);
				}
			}
		}
	});
};
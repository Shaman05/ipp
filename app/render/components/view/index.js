/**
 * Created by ChenChao on 2018/5/16.
 */

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
				}
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
				return !!this.betweenVersion.fromHash && !!this.betweenVersion.toHash;
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
					this.gulp.runTaskByName('build', [], {
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
				//util.sendCommand('print', 'Test print message, haha!!!');
			},
			md5(){
				let self = this;
				util.selectDir({
					title: `请选择要校验的文件`,
					defaultPath: this.repoDir,
					onSelect(filePath) {
						let hashResult = util.hashFile(filePath, (e)=> {
							self.$Notice.error({title: `SHA1 失败`, desc: `原因：<br/>${e}!`});
						});
						if(hashResult){
							let {hash, size} = hashResult;
							self.$Notice.success({title: `Success!`});
							self.hashResult = JSON.stringify({
								file: filePath,
								hash,
								method: `md5 sha1`,
								size
							}, true, 2);
						}
					}
				}, true);
			}
		}
	});
};
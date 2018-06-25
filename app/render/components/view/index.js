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
				buildArray: []
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
					this.openRepo();
				}
				if(name === 'build'){
					this.tab = 'build';
					let tasks = this.gulp.getTasks();
					console.log(tasks);
					this.gulp.runTaskByName('test');
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
			canBuild() {
				return !!this.betweenVersion.fromHash && !!this.betweenVersion.toHash;
			},
			setting(){},
			build(){
				let {fromHash, toHash} = this.betweenVersion;
				this.gulp.runTaskByName('zip:changes', [`--v1=${fromHash}`, `--v2=${toHash}`]);
			},
			construct(){
			
			},
			md5(){},
			print(content){
			
			}
		}
	});
};
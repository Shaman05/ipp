//entry index

const {ipcRenderer} = require('electron');
const Vue = require('vue/dist/vue');
const VueRouter = require('vue-router');
const iView = require('iview');
const routers = require('./routers');
const components = require('./components');
const util = require('./js/util');
let config = require('../config');

module.exports.start = function () {
	
	Vue.use(VueRouter);
	Vue.use(iView);
	let cps = components.init(config, util);
	let routes = routers(cps, config, util);
	routes.push({
		path: '/',
		redirect: '/home'
	});
	
	const router = new VueRouter({routes});
	window.VueApp = new Vue({
		router,
		data(){
			return {
				md5Model: false,
				md5Checking: false,
				md5File: '',
				md5Value: ''
			};
		},
		created(){},
		mounted(){
			console.log('page mounted!');
		},
		methods: {
			selectMd5File(){
				let that = this;
				util.selectDir({
					title: '请选择要md5校验的文件',
					onSelect(file){
						that.md5File = file;
					}
				}, true);
			},
			doMd5Check(){
				this.md5Checking = true;
				util.hashFile(this.md5File, result => {
					let {hash, size} = result;
					this.md5Value = hash;
					this.md5Checking = false;
					console.log(`[md5 completed]:`, result);
				}, err => {
					console.log(err);
					this.md5Checking = false;
				});
			}
		}
	}).$mount('#app');
	window.openDir = function () {
		VueApp.$emit('open dir');
	};
	window.md5Check = function () {
		VueApp.md5Model = true;
		VueApp.md5File = '';
		VueApp.md5Value = '';
		VueApp.md5Checking = false;
	};
	
	// ipcRenderer.on('open dir', (event, message) => {
	// 	VueApp.$emit('open dir');
	// });
};
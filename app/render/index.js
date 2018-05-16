//entry index

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
			return {};
		},
		created(){},
		mounted(){
			console.log('page mounted!');
		}
	}).$mount('#app')
};
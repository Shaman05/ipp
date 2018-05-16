/**
 * Created by ChenChao on 2018/5/16.
 */

const Vue = require('vue/dist/vue');

module.exports = function (name, template, config, util) {
	return Vue.component(name, Vue.extend({
		template,
		props: {
			row: Object
		},
		mounted(){
			console.log(`${name} mounted!`);
		}
	}));
};
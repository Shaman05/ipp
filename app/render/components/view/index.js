/**
 * Created by ChenChao on 2018/5/16.
 */

const Vue = require('vue/dist/vue');

module.exports = function (components, template, config, util) {
	return Vue.extend({
		template,
		data() {
			return {
				isCollapsed: false,
				repoName: '',
				repoDir: '',
				filterKey: ''
			}
		},
		computed: {
			menuItemClasses() {
				return ['menu-item', this.isCollapsed ? 'collapsed-menu' : ''];
			}
		},
		created(){
			let {name, dir} = this.$route.params;
			this.repoName = name;
			this.repoDir = dir;
		},
		methods: {
			selectMenu(name){
				if(name === 'back'){
					history.back();
				}
				if(name === 'info'){
					this.openRepo();
				}
				if(name === 'setting'){
					this.setting();
				}
			},
			openRepo(){
			
			},
			setting(){}
		}
	});
};
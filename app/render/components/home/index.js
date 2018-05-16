/**
 * Created by ChenChao on 2018/5/16.
 */

const git = require('../../js/git');
const Vue = require('vue/dist/vue');

module.exports = function (components, template, config, util) {
	return Vue.extend({
		template,
		data(){
			return {
				historyList: [
					{
						name: 'XBlockly',
						dir: 'F:/work-git/XBlockly'
					},
					{
						name: 'XKit',
						dir: 'E:/work-git/Xkit'
					},
					{
						name: 'XKit',
						dir: 'E:/work-git/Xkit'
					}
				]
			}
		},
		created(){
		
		},
		methods: {
			addRepo(){
				console.log('add repo!');
			},
			openMore(){
				console.log('open more project!');
			},
			openRepo(project){
				let repo = new git(project.dir);
				repo.getLogs();
			},
			removeRepo(project){
				console.log(`remove project:`, project);
			}
		}
	});
};
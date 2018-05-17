/**
 * Created by ChenChao on 2018/5/16.
 */

const Git = require('../../js/git');
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
			this.storage = util.getStorage();
		},
		methods: {
			addRepo(){
				let self = this;
				util.selectDir({
					title: '请选择一个Git仓库',
					onSelect(dir){
						let repo = new Git(dir);
						repo.status((err, result)=>{
							let isRepo = true;
							let title  = `添加仓库`;
							let {name} = util.parsePath(dir);
							if(err){
								self.$Notice.error({
									title,
									desc: `添加失败，原因：<br/>${err}!`
								});
								isRepo = false;
							}
							if(isRepo){
								util.updateRepo(name, dir, (err)=>{
									if(err){
										self.$Notice.error({
											title,
											desc: `添加失败，原因：<br/>${err}!`
										});
									}else{
										self.$Notice.success({
											title,
											desc: `已添加：${name}!`
										});
									}
								});
							}
						});
					}
				});
			},
			openMore(){
				console.log('open more project!');
			},
			openRepo(project){
				console.log('open project!');
			},
			removeRepo(project){
				console.log(`remove project:`, project);
			}
		}
	});
};
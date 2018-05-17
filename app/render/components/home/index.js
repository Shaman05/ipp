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
				showNum: 3,
				historyList: []
			}
		},
		created(){
			this.showHistoryRepos();
		},
		methods: {
			showHistoryRepos(){
				let storageDate = util.getStorage();
				let totalRepos = storageDate.repos || {};
				this.historyList = util.objectToArray(totalRepos, 'timestamp').slice(0, this.showNum);
			},
			addRepo(){
				let self = this;
				util.selectDir({
					title: '请选择一个Git仓库',
					onSelect(dir){
						let repo = new Git(dir);
						repo.status((err, result)=>{
							let title  = `添加仓库`;
							let {name} = util.parsePath(dir);
							if(err){
								return self.$Notice.error({title, desc: `添加失败，原因：<br/>${err}!`});
							}
							util.updateRepo({action: 'add', name, dir}, (err)=>{
								if(err){
									self.$Notice.error({title, desc: `添加失败，原因：<br/>${err}!`});
								}else{
									self.$Notice.success({title: `已添加：${name}!`});
									self.showHistoryRepos();
								}
							});
						});
					}
				});
			},
			removeRepo(project){
				util.removeRepo.call(this, project.name, ()=>{
					this.showHistoryRepos();
				});
			},
			openRepo(project){
				console.log('open project!');
			}
		}
	});
};
/**
 * Created by ChenChao on 2018/5/16.
 */

const Vue = require('vue/dist/vue');

module.exports = function (components, template, config, util) {
	let {tableExpend} = components;
	return Vue.extend({
		components: { tableExpend },
		template,
		data () {
			return {
				columns: [
					{
						type: 'expand',
						width: 60,
						render: (h, params)=>{
							return h(tableExpend, {
								props: {
									row: params.row
								}
							})
						}
					},
					{
						title: 'Repository',
						key: 'name',
						sortable: true
					},
					{
						title: 'Last view',
						key: 'open',
						sortable: true,
						sortType: 'desc'
					},
					{
						title: 'Action',
						key: 'action',
						width: 150,
						align: 'center',
						render: (h, params)=>{
							return h('div', [
								h('Button', {
									props: {
										type: 'primary',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.viewRepo(params);
										}
									}
								}, 'View'),
								h('Button', {
									props: {
										type: 'error',
										size: 'small'
									},
									on: {
										click: () => {
											this.removeRepo(params);
										}
									}
								}, 'Delete')
							]);
						}
					}
				],
				data: []
			}
		},
		created(){
			let storageDate = util.getStorage();
			let totalRepos = storageDate.repos || {};
			totalRepos = util.objectToArray(totalRepos);
			totalRepos.forEach((repo, index)=>{
				this.data.push(repo);
			});
		},
		methods: {
			returnHone(){
				history.back();
			},
			viewRepo(repo){
				let {name, dir} = repo.row;
				this.$router.push({
					name: 'view',
					params: {name, dir}
				});
			},
			removeRepo(repo){
				util.removeRepo.call(this, repo.row.name, ()=>{
					this.data.splice(repo.index, 1);
				});
			}
		}
	});
};
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
						width: 50,
						render: (h, params)=>{
							return h(tableExpend, {
								props: {
									row: params.row
								}
							})
						}
					},
					{
						title: 'Name',
						key: 'name'
					},
					{
						title: 'Age',
						key: 'age'
					},
					{
						title: 'Address',
						key: 'address'
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
											console.log('show:', params.index);
											this.showMore(params.index);
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
											console.log('delete:', params.index);
											this.removeRepo(params.index);
										}
									}
								}, 'Delete')
							]);
						}
					}
				],
				data: [
					{
						name: 'John Brown',
						age: 18,
						address: 'New York No. 1 Lake Park',
						job: 'Data engineer',
						interest: 'badminton',
						birthday: '1991-05-14',
						book: 'Steve Jobs',
						movie: 'The Prestige',
						music: 'I Cry'
					},
					{
						name: 'Jim Green',
						age: 25,
						address: 'London No. 1 Lake Park',
						job: 'Data Scientist',
						interest: 'volleyball',
						birthday: '1989-03-18',
						book: 'My Struggle',
						movie: 'Roman Holiday',
						music: 'My Heart Will Go On'
					},
					{
						name: 'Joe Black',
						age: 30,
						address: 'Sydney No. 1 Lake Park',
						job: 'Data Product Manager',
						interest: 'tennis',
						birthday: '1992-01-31',
						book: 'Win',
						movie: 'Jobs',
						music: 'Don’t Cry'
					}
				]
			}
		},
		methods: {
			returnHone(){
				history.back();
			},
			showMore(index){
				this.$Modal.info({
					title: 'Repo Info',
					content: `Name：${this.data[index].name}<br/>Age：${this.data[index].age}<br/>Address：${this.data[index].address}`
				})
			},
			removeRepo(index){
				this.data.splice(index, 1);
			}
		}
	});
};
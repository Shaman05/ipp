/**
 * Created by ChenChao on 2018/5/16.
 */

const Git = require('../../js/git');
const Vue = require('vue/dist/vue');

module.exports = function (name, template, config, util) {
	return Vue.component(name, Vue.extend({
		template,
		props: {
			row: Object
		},
		data(){
			return {
				status: {},
				statusReady: false,
				latestLog: {},
				latestLogReady: false
			}
		},
		mounted() {
			console.log(`${name} mounted!`);
			this.git = new Git(this.row.dir);
			this.getRepoStatus();
			this.getRepoLogs();
		},
		methods: {
			openDir: util.openPath,
			getRepoStatus(){
				this.git.status((err, result)=>{
					console.log(result);
					this.status = result;
					this.statusReady = true;
				});
			},
			getRepoLogs(){
				this.git.getLogs((err, result)=>{
					console.log(result);
					this.latestLog = result.latest;
					this.latestLogReady = true;
				});
			}
		}
	}));
};
/**
 * Created by ChenChao on 2018/5/16.
 */

const simpleGit = require('simple-git');

function Git(dir, options){
	this.git = simpleGit(dir);
	return this;
}

Git.prototype = {
	status(callback){
		this.git.status((err, result)=>{
			console.log(err);
			console.log(result);
			callback && callback(err, result);
		});
	},
	getLogs(callback){
		this.git.log((err, result)=>{
			console.log(err);
			console.log(result);
			callback && callback(err, result);
		});
	}
};

module.exports = Git;
/**
 * Created by ChenChao on 2018/5/16.
 */

module.exports.init = function (config, util) {
	let componentsMap = [
		'tableExpend',
	], components = {};
	componentsMap.forEach((name, index)=>{
		let template = util.getComponentTpl(name);
		components[name] = require(`./components/${name}`)(name, template, config, util);
	});
	return components;
};
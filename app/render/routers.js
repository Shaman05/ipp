/**
 * Created by ChenChao on 2018/5/16.
 */

module.exports = function (components, config, util) {
	let routeMap = {
		'home': '首页',
		'projects': '仓库列表',
	};
	let routes = [];
	for (let route in routeMap) {
		if (routeMap.hasOwnProperty(route)) {
			let template = util.getComponentTpl(route);
			routes.push({
				path: `/${route}`,
				name: route,
				component: require(`./components/${route}`)(components, template, config, util)
			});
		}
	}
	return routes;
};
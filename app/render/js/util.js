/**
 * Created by ChenChao on 2018/5/16.
 */

const path = require('path');
const fs = require('fs');

module.exports = {
	getComponentTpl(name){
		let tplFile = path.resolve(__dirname, `../components/${name}/tpl.html`);
		return fs.readFileSync(tplFile, 'utf-8');
	}
};
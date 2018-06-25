//创建应用菜单

const electron = require('electron');
const {Menu, shell, dialog} = electron;
let config = require('../config');
let {pkg, icons} = config;

module.exports = {
	init(win, debug){
		const template = [
			{
				label: 'Open',
				submenu: [
					{
						label: '添加仓库',
						accelerator: 'CmdOrCtrl+O',
						click(){
							//todo: open dir
						}
					}
				]
			},
			{
				label: 'Tools',
				submenu: [
					{
						label: 'md5 校验',
						click(){
							//todo:
						}
					}
				]
			},
			{
				label: 'Help',
				submenu: [
					{
						label: '帮 助',
						accelerator: 'CmdOrCtrl+H',
						click(){
							shell.openExternal('https://github.com/Shaman05/ipp');
						}
					},
					{
						label: '关 于',
						click(){
							let msg = [
								`关于 ${pkg.name}`,
								`版本: ${pkg.version}`,
								`作者: ${pkg.author}`,
								`由 Electron + Vue + Webpack 驱动.`
							];
							dialog.showMessageBox(win, {
								type: 'info',
								icon: icons.png48,
								title: `About ${pkg.name}`,
								message: msg.join('\n'),
								buttons: ['OK']
							});
						}
					}
				]
			}
		];
		
		if (process.platform === 'darwin') {
		
		}
		
		if(debug){
			template.push({
				label: 'Window',
				submenu: [
					{label: '全屏切换', role: 'togglefullscreen'},
					{type: 'separator'},
					{label: '退 出', role: 'close', accelerator: 'CmdOrCtrl+',}
				]
			});
		}
		
		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	}
};
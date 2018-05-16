//创建应用菜单

const electron = require('electron');
const {Menu, shell, dialog} = electron;
let config = require('../config');
let {pkg, icons} = config;

module.exports = {
  init(win){
	const template = [
	  {
		label: 'Open',
		submenu: [
		  {
			label: 'Repository',
			accelerator: 'CmdOrCtrl+O',
			click(){
			  //todo: open dir
			}
		  },
		  {type: 'separator'},
		  {
		    label: 'Exit',
		    role: 'close'
		  }
		]
	  },
	  {
		label: 'Tools',
		submenu: [
		  {
			label: 'Hash File',
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
			label: 'Learn More',
			accelerator: 'CmdOrCtrl+H',
			click(){
			  shell.openExternal('https://github.com/Shaman05/ipp');
			}
		  },
		  {
			label: 'About',
			click(){
			  let msg = [
				`关于增量打包程序 ${pkg.name}`,
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

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
  }
};
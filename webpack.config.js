/**
 * Created by ChenChao on 2017/11/2.
 */

const path = require('path');

module.exports = [
  //主进程配置
  {
	target: 'electron',
	node: {
	  __filename: true,
	  __dirname: true
	},
	entry: {
	  main: path.join(__dirname, 'app/main/main.js')
	},
	output: {
	  path: path.resolve(__dirname, 'dist/app/main/'),
	  filename: '[name].js'
	},
	externals: [],
	watchOptions: {
	  poll: 1000,
	  aggregeateTimeout: 500,
	  ignored: /node_modules/,
	},
	plugins: []
  },
  //渲染进程配置
  {
	target: 'electron',
	node: {
	  __filename: true,
	  __dirname: true
	},
	entry: {
	  index: path.join(__dirname, 'app/render/index.js')
	},
	output: {
	  path: path.resolve(__dirname, 'dist/app/render/'),
	  filename: '[name].js',
	  //设置入口文件为umd模块
	  libraryTarget: 'umd',
	  umdNamedDefine: true
	},
	externals: [],
	watchOptions: {
	  poll: 1000,
	  aggregeateTimeout: 500,
	  ignored: /node_modules/,
	},
	plugins: []
  }
];
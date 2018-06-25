const { spawn } = require('child_process');
const ls = spawn('node', ['E:\\work-git\\XBlockly\\node_modules\\gulp\\bin\\gulp.js', 'test']);

ls.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
	console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
	console.log(`子进程退出码：${code}`);
});
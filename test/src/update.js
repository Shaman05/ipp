/**
 * Created by ChenChao on 2017/12/12.
 */

const request = require('request');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const child_process = require('child_process');
const progress = require('progress-stream');
const AdmZip = require('adm-zip');

module.exports.getRemoteVersion = function getRemoteVersion(uri, callback) {
  let req = https.request(uri, function (res) {
	let body = '';
	res.on('data', function (chunk) {
	  body += chunk;
	});
	res.on('end', function () {
	  try {
		let data = JSON.parse(body);
		callback(null, data);
	  } catch (e) {
		console.log(e);
		callback(e);
	  }
	});
  });
  req.on('error', function (e) {
	console.log('请求出错：');
	console.log(e);
	callback(e);
  });
  req.end();
};

module.exports.downloadFile = function downloadFile(uri, savePath, callback) {
  let {protocol, pathname} = url.parse(uri);
  let basename = path.basename(pathname);
  let saveFile = path.join(savePath, basename);
  let requestByProtocol = protocol === 'https:' ? https.request : http.request;

  let totalSize = 0;
  let passedLength = 0;

  let pp = request.get(uri);
  //console.log(`尝试连接下载地址 ${uri}，请耐心等待片刻...`);
  pp.on('error', function (err) {
	console.log('出错！');
	console.log(err);
	callback(err);
  }).on('response', function (res) {
	if (res.statusCode !== 200) {
	  console.log('文件下载失败！原因：');
	  console.log(res.statusCode, res.statusMessage);
	  callback({
		message: '文件下载失败！statusCode: ' + res.statusCode,
		details: res.statusMessage
	  });
	} else {
	  totalSize = res.caseless.dict['content-length'];
	  //console.log('连接下载地址成功！获取文件大小：' + totalSize + ' bytes!，准备下载...');
	  console.time('下载耗时');

	  let req = requestByProtocol(uri, function (res) {
		let stream = fs.createWriteStream(saveFile, {
		  flags: 'w',
		  mode: 0o666,
		  autoClose: true
		});
		stream.on('open', function () {
		});
		stream.on('error', function (err) {
		  console.log('保存文件出错：');
		  console.log(err);
		});
		stream.on('close', function () {
		  //console.log(`文件已保存至本地!${saveFile}`);
		  console.timeEnd('下载耗时');
		  callback && callback(null, saveFile);
		});
		res.on('data', function (chunk) {
		  passedLength += chunk.length;
		  stream.write(chunk);
		});
		res.on('end', function () {
		  stream.end();
		});
	  });
	  req.on('error', function (e) {
		console.log('请求出错：');
		console.log(e);
		callback(e);
	  });
	  req.end();
	}
  });
};

//批量下载包
module.exports.downloadPackages = function downloadPackages(uris, savePath, onError, callback){
  let total = uris.length;
  let index = 0;
  let savedPackages = [];
  doDownload();
  function doDownload(){
    let packageUrl = uris[index];
    console.log(`开始下载：`, packageUrl);
	module.exports.downloadFile(packageUrl, savePath, function (err, packageFile) {
	  if(!err){
	    console.log(`已下载：`, packageFile);
		savedPackages.push(packageFile);
		if(index === total - 1){
		  callback && callback(savedPackages);
		}else{
		  index += 1;
		  doDownload();
		}
	  }else{
		onError && onError();
	  }
	});
  }
};

module.exports.extraZip = function extraZip(zipFile, targetPath, callback) {
  let zip = new AdmZip(zipFile);
  //解压全部
  console.time('解压文件');
  zip.extractAllTo(targetPath, /*overwrite*/true);
  console.timeEnd('解压文件');
  callback && callback();
};

/**
 * 移动文件
 * @param sourceFilesDir
 * @param fileMap
 * @param pagesDir
 * @param callback
 */
module.exports.replaceFile = function (sourceFilesDir, fileMap, pagesDir, callback) {
  let rootDir = path.resolve(pagesDir, '../');
  fs.readdir(sourceFilesDir, function (err, files) {
	if (!err) {
	  console.log(`待替换文件列表：`, files);
	  files.forEach(function (file, index) {
		let fileReplacePath = fileMap[file];
		if (fileReplacePath) {
		  let destFilePath = path.join(rootDir, fileReplacePath, file);
		  console.log(`替换文件：${file} -> ${destFilePath}`);
		  fs.renameSync(path.join(sourceFilesDir, file), destFilePath);
		}
	  });
	  callback && callback();
	}
  })
};

/**
 * 下载全量安装包
 * @param source
 * @param dest
 * @param onProgress
 */
module.exports.downloadPackage = function (source, dest, onProgress) {
  let {packageName, pkgSize, downloadUri} = source;
  let str = progress({
	time: 1000,
	length: pkgSize
  });
  let resource = downloadUri + packageName;
  let target = path.join(dest, packageName);
  let size = bytesToSize(pkgSize);

  str.on('progress', (progress) => {
	onProgress(size, progress, target);
  });

  console.log(`开始更新source：${resource}，size: ${size}`);
  request.get({
	url: resource,
	headers: {}
  }).pipe(str).pipe(fs.createWriteStream(target));
};

module.exports.installPackage = function (exePackage, callback) {
  let execFile = child_process.execFile;
  console.log(`install exe:`, exePackage);
  execFile(exePackage, function(err, data) {
	callback && callback(err, data);
  });
};

function bytesToSize(bytes) {
  if (bytes === 0) {
	return '0 B';
  }
  let k = 1024;
  sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}
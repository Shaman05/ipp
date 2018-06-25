
const gulp = require('gulp');
const uglifyjs = require('uglify-js');
const uglifyEs = require('uglify-es');
const composer = require('gulp-uglify/composer');
const pump = require('pump');
const minify = composer(uglifyEs, console);

gulp.task('compress', function (cb) {
	// the same options as described above
	let options = {};
	pump([
			gulp.src('./src/*.js'),
			minify(options),
			gulp.dest('./dist')
		],
		cb
	);
});
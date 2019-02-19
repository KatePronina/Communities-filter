'use strict'

module.exports = function () {
	$.gulp.task('sass', function() {
	return $.gulp.src('./source/style/app.css')
		.pipe($.gp.autoprefixer({
			browsers: [
				'last 2 version'
			]
		}))
		.pipe($.gulp.dest('./build/assets/css'))
	});
}


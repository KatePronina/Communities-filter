'use strict';

module.exports = function() {
  $.gulp.task('watch', function() {
    $.gulp.watch('./source/style/**/*.css', $.gulp.series('sass'));
    $.gulp.watch('./source/index.html', $.gulp.series('html'));
    $.gulp.watch('./js/*', $.gulp.series('concat'));
  });
};
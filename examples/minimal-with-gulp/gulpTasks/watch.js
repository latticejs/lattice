import gulp from 'gulp';
import { lint } from './lint';

gulp.task('watch', () => {
  gulp.watch(['./src/*.jsx', './src/*.js'], gulp.series(lint));
});

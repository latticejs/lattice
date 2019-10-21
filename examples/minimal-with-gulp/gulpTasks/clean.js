import gulp from 'gulp';
import del from 'del';

gulp.task('clean:dev', () => del('dist'));

gulp.task('clean:prod', () => del('build'));

gulp.task('clean', gulp.parallel('clean:dev', 'clean:prod'));

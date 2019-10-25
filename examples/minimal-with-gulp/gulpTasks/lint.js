import eslint from 'gulp-eslint';
import gulp from 'gulp';

gulp.task('lint', () =>
    gulp
        .src(['src/*.jsx', 'src/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
);

export const lint = gulp.task('lint');

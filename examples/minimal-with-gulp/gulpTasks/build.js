import gulp from 'gulp';
import webpackConfig from '../webpack.config';
import webpackStream from 'webpack-stream';
import { cleanDev, cleanProd } from './clean';

gulp.task('build:dev', () => {
  process.env.NODE_ENV = JSON.stringify('development');
  process.env.REACT_SPINKIT_NO_STYLES = JSON.stringify(false);
  return gulp
    .src('src/index.js')
    .pipe(webpackStream(webpackConfig.dev))
    .pipe(gulp.dest('dist'));
});
gulp.task('build:dev', gulp.series(cleanDev, 'build:dev'));
gulp.task('build:prod', () => {
  process.env.NODE_ENV = JSON.stringify('production');
  process.env.REACT_SPINKIT_NO_STYLES = JSON.stringify(false);
  return gulp
    .src('src/index.js')
    .pipe(webpackStream(webpackConfig.prod))
    .pipe(gulp.dest('build'));
});
gulp.task('build:prod', gulp.series(cleanProd, 'build:prod'));
gulp.task('build', gulp.series('build:dev', 'build:prod'));

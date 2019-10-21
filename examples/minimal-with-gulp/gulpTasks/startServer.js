import express from 'express';
import gulp from 'gulp';
import helmet from 'helmet';
// import https from 'https';
import path from 'path';
import rootDir from 'app-root-dir';
import webpack from 'webpack';
import webpackConfig from '../webpack.config';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackMiddleware from 'webpack-dev-middleware';

gulp.task('startServer:dev', () => {
  const app = express();
  const port = 4500;
  const baseDir = 'dist';
  const compiler = webpack(webpackConfig);
  app.use(
    webpackMiddleware(compiler, {
      noInfo: true
    })
  );
  app.use(webpackHotMiddleware(compiler));

  app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir.get(), baseDir, '/src/index.html'));
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on ${port}...`);
  });
});

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
  const port = 3000;
  const baseDir = 'dist';
  const compiler = webpack(webpackConfig.dev);

  app.use(
    webpackMiddleware(compiler, {
      noInfo: true,
      hot: true,
      inline: true,
      publicPath: webpackConfig.dev.output.publicPath
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

gulp.task('startServer:prod', () => {
  const app = express();
  const port = 3000;
  const baseDir = 'build';

  app.use(helmet());
  app.get('*.js', (req, res) => {
    if (req.url.indexOf('bundle') > -1) {
      res.set('Content-Type', 'application/octet-stream; charset=UTF-8');
      res.set('Content-Encoding', 'gzip');
      res.set('X-Content-Type-Options', 'no');
      res.sendFile(path.join(rootDir.get(), baseDir, '/bundle.js.gz'));
    }
  });

  app.get('*.css', (req, res) => {
    res.set('Content-Encoding', 'gzip');
    res.type('text/css; charset=UTF-8');
    res.removeHeader('Content-Length');
    res.removeHeader('Cache-Control');
    res.set('Vary', 'Accept-Encoding');
    res.sendFile(path.join(rootDir.get(), baseDir, '/bundle.css.gz'));
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(rootDir.get(), baseDir, '/src/index.html'));
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on ${port}...`);
  });
});

gulp.task('startServer', () => gulp.series('startServer:prod', 'startServer:dev'));
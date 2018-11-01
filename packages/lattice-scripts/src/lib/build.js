import { join } from 'path';
import { rollup } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import minify from 'rollup-plugin-babel-minify';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  classnames: 'classnames'
};

const commonExternals = ['@babel/runtime/helpers', '@material-ui/core/'];

export default async (input, { formats = ['cjs', 'esm', 'umd'], env = process.env.NODE_ENV }) => {
  const baseDir = process.cwd();
  let pkg;

  try {
    pkg = require(join(baseDir, 'package.json'));
  } catch (error) {
    throw Error(`No package.json file found on ${baseDir}`);
  }

  input = join(baseDir, input);
  const name = pkg.name.split('/').pop();
  const production = env === 'production';

  const dests = {
    umd: pkg.browser,
    cjs: pkg.main,
    esm: pkg.module
  };

  const allExternals = Object.keys(pkg.peerDependencies)
    .concat(Object.keys(pkg.dependencies))
    .concat(commonExternals);

  const external = id => allExternals.some(ex => id.startsWith(ex));

  const plugins = [
    babel({
      exclude: /node_modules/,
      runtimeHelpers: true
    }),

    resolve({
      jsnext: true,
      browser: true,
      customResolveOptions: {
        moduleDirectory: join(baseDir, 'src')
      }
    }),

    commonjs({
      include: /node_modules/,
      namedExports: {
        '@material-ui/core/styles': ['withStyles']
      }
    }),

    replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),

    production && minify()
  ];

  const inputOptions = {
    input,
    external,
    plugins,
    treeshake: {
      pureExternalModules: true
    },
    onwarn: (warning, warn) => {
      if (['MISSING_GLOBAL_NAME', 'UNUSED_EXTERNAL_IMPORT'].includes(warning.code)) return;
      if (warning.code === 'NON_EXISTENT_EXPORT') throw new Error(warning.message);

      warn(warning);
    }
  };

  const outputOptions = (format, file) => ({
    format,
    file,
    name,
    globals,
    sourcemap: !production,
    exports: 'named'
  });

  const bundle = await rollup(inputOptions);
  const result = {};
  for (const format of formats) {
    result[format] = await bundle.write(outputOptions(format, dests[format]));
  }

  return result;
};

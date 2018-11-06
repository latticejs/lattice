import path from 'path';
import { rollup } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import minify from 'rollup-plugin-babel-minify';

const FORMATS = {
  ESM: 'esm',
  CJS: 'cjs',
  UMD: 'umd'
};

const COMMON_GLOBALS = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
  classnames: 'classnames'
};

const COMMON_EXTERNALS = ['@babel/runtime/helpers', '@material-ui/core/'];

const onwarn = (warning, warn) => {
  if (['MISSING_GLOBAL_NAME', 'UNUSED_EXTERNAL_IMPORT'].includes(warning.code)) return;
  if (warning.code === 'NON_EXISTENT_EXPORT') throw new Error(warning.message);

  warn(warning);
};

const DEFAULT_CONFIG = {
  codeSplitting: [],
  outputFolder: 'dist'
};

export default async (input, { formats = [FORMATS.CJS, FORMATS.ESM, FORMATS.UMD], env = process.env.NODE_ENV }) => {
  const production = env === 'production';
  const baseDir = process.cwd();
  const config = loadConfig({ baseDir });
  const { name, dests, external } = loadPkgInfo({ baseDir, config });
  const plugins = getPlugins({ env, baseDir, production });
  const codeSplitting = Boolean(config.codeSplitting.length);

  const inputOptions = {
    external,
    plugins,
    treeshake: {
      pureExternalModules: true
    },
    onwarn
  };

  const outputOptions = {
    name,
    globals: COMMON_GLOBALS,
    sourcemap: !production,
    exports: 'named'
  };

  const jobs = formats.map(format => {
    const notUMD = format !== FORMATS.UMD;

    const bundleInputOptions = {
      ...inputOptions,
      input:
        notUMD && codeSplitting ? [input].concat(config.codeSplitting.map(file => path.join(baseDir, file))) : input,
      experimentalCodeSplitting: notUMD && codeSplitting
    };

    const bundleOutputOptions = {
      ...outputOptions,
      format,
      ...(notUMD && codeSplitting ? { dir: path.join(baseDir, config.outputFolder, format) } : { file: dests[format] })
    };

    console.log({ bundleInputOptions, bundleOutputOptions });

    return rollup(bundleInputOptions)
      .then(bundle => bundle.write(bundleOutputOptions))
      .then(result => ({ format, result }))
      .catch(console.error);
  });

  const result = (await Promise.all(jobs)).reduce((acc, { format, result }) => {
    acc[format] = result;
    return acc;
  }, {});

  return result;
};

const getExternalFn = ({ pkg }) => {
  const allExternals = Object.keys(pkg.peerDependencies || [])
    .concat(Object.keys(pkg.dependencies || []))
    .concat(COMMON_EXTERNALS);

  return id => allExternals.some(ex => id.startsWith(ex));
};

const getPlugins = ({ env, baseDir, production }) => [
  babel({
    exclude: /node_modules/,
    runtimeHelpers: true
  }),

  resolve({
    jsnext: true,
    browser: true,
    customResolveOptions: {
      moduleDirectory: path.join(baseDir, 'src')
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

const loadPkgInfo = ({ baseDir, config }) => {
  let pkg;

  try {
    pkg = require(path.join(baseDir, 'package.json'));
  } catch (error) {
    throw Error(`No package.json file found on ${baseDir}`);
  }

  const name = pkg.name.split('/').pop();

  const dests = {
    [FORMATS.UMD]: pkg.browser || `./${config.outputFolder}/umd/index.js`,
    [FORMATS.CJS]: pkg.main || `./${config.outputFolder}/cjs/index.js`,
    [FORMATS.ESM]: pkg.module || `./${config.outputFolder}/esm/index.js`
  };

  const external = getExternalFn({ pkg });

  return {
    name,
    dests,
    external
  };
};

const loadConfig = ({ baseDir }) => {
  try {
    const buildConfig = require(path.join(baseDir, 'lattice-scripts.config.js'));
    return { ...DEFAULT_CONFIG, ...buildConfig.build };
  } catch (error) {
    console.log(`\nNo lattice-scripts.config.js file found on ${baseDir}.\n`);
  }

  return DEFAULT_CONFIG;
};

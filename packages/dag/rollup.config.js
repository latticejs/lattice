import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const input = 'src/index.js';
const name = 'dag';

const env = process.env.NODE_ENV || 'development';
const production = env === 'production';
const formats = process.env.FORMAT ? process.env.FORMAT.split('-') : ['umd'];

const dests = {
  umd: pkg.browser,
  cjs: pkg.main,
  esm: pkg.module,
};

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

const external = Object.keys(pkg.peerDependencies).concat(Object.keys(pkg.dependencies));

const plugins = [
  babel({
    exclude: /node_modules/,
    runtimeHelpers: true,
  }),

  resolve({
    jsnext: true,
    browser: true,
    customResolveOptions: {
      moduleDirectory: './src',
    },
  }),

  commonjs({
    include: /node_modules/,
    namedExports: {
      '@material-ui/core/styles': ['withStyles'],
    },
  }),

  replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),

  production &&
    terser({
      sourcemap: !production,
    }),
];

const rollupConf = {
  input,
  external,
  output: {
    name,
    globals,
    exports: 'named',
    sourcemap: !production,
  },
  plugins,
  treeshake: {
    pureExternalModules: true,
  },
};

const configFor = (file, format) => ({
  ...rollupConf,
  output: {
    ...rollupConf.output,
    file,
    format,
  },
});

export default formats.map((format) => configFor(dests[format], format));

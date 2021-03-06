import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package';

const baseRollupPlugins = [
  babel({
    exclude: ['node_modules/**', '../../node_modules/**'],
    runtimeHelpers: true,
  }),
  commonjs({
    include: ['node_modules/**', '../../node_modules/**'],
    namedExports: {
      react: ['Children', 'Component', 'PropTypes', 'createElement'],
      'react-dom': ['render', 'findDOMNode'],
    },
  }),
  resolve({
    jsnext: true,
    main: true,
    modulesOnly: true,
  }),
];

const external = Object.keys(pkg.peerDependencies).concat(Object.keys(pkg.dependencies));

export async function cjs(task, opts) {
  await task
    .source('src/index.js')
    .rollup({
      plugins: baseRollupPlugins,
      external,
      output: {
        file: 'recharts-sunburst.js',
        format: 'cjs',
      },
      onwarn: (warning) => {
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          // skip it
          return;
        }
      },
    })
    .target('dist/');
}

export async function es(task, opts) {
  await task
    .source('src/index.js')
    .rollup({
      plugins: baseRollupPlugins,
      external,
      output: {
        file: 'recharts-sunburst.es.js',
        format: 'es',
      },
      onwarn: (warning) => {
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          // skip it
          return;
        }
      },
    })
    .target('dist/es');
}

export async function modules(task) {
  await task.parallel(['cjs', 'es']);
}

export async function compile(task, opts) {
  await task
    .source(opts.src || 'src/**/*.js')
    .babel()
    .target('dist/');
}

export async function build(task) {
  await task.serial(['compile', 'modules']);
}

export default async function (task) {
  await task.start('build');
  await task.watch('src/**/*.js', ['compile', 'modules']);
}

export async function release(task) {
  await task.clear('dist').start('build');
}

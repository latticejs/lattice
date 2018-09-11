import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

module.exports = {
  input: 'src/main.js',
  output: [{ file: pkg.main, format: 'cjs', sourcemap: true }, { file: pkg.module, format: 'es', sourcemap: true }],
  plugins: [production && terser()],
  external: ['storybook-readme']
};

import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import hashbang from 'rollup-plugin-hashbang';
import json from 'rollup-plugin-json';

const external = Object.keys(pkg.dependencies).concat(['path']);
const plugins = [
  json(),
  hashbang(),
  resolve({
    browser: true,
    jsnext: true,
    customResolveOptions: {
      moduleDirectory: './src'
    }
  }),
  commonjs({
    include: /node_modules/
  })
];

export default [
  {
    input: './cli.js',
    external,
    plugins,
    output: {
      file: pkg.bin,
      format: 'cjs'
    }
  },
  {
    input: './index.js',
    external,
    plugins,
    output: {
      file: pkg.main,
      format: 'cjs'
    }
  }
];

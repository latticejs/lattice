#!/usr/bin/env node
import program from 'commander';
import registerBuild from './build';

import pkg from '../../package.json';

program
  .version(pkg.version)
  .usage('command')
  .description(pkg.description);

registerBuild(program);

program.parse(process.argv);

export default program;

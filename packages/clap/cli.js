#!/usr/bin/env node

// \\ CLAP => Create Lattice App \\

const program = require('commander');
const clapi = require('../lib');
const pkg = require('../package.json');

const DEFAULT_EXAMPLE = 'enterprise-demo';

program.version(pkg.version).description(pkg.description);

program
  .command('example <exampleName> <projectName>')
  .alias('e')
  .description(clapi.messages.describeClap())
  .action(clapi.clap);

program.on('command:*', function(args) {
  // runs: clap projectName
  // shortcut for clap example enterprise-demo projectName
  clapi.clap(DEFAULT_EXAMPLE, args[0]);
});

// start program
program.parse(process.argv);

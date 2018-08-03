#!/usr/bin/env node
// \\ CLAP => Create Lattice App \\

var program = require('commander');
var clapi = require('./lib');
var pkg = require('./package.json');

var DEFAULT_EXAMPLE = (exports.DEFAULT_EXAMPLE = 'basic');

program
  .version(pkg.version)
  .usage('[options] [command] <projectName>')
  .description(pkg.description);

program
  .command('example <exampleName> <projectName>')
  .alias('e')
  .description(clapi.messages.describeClap())
  .action(clapi.clap);

program
  .command('list')
  .alias('ls')
  .description(clapi.messages.describeList())
  .action(clapi.list);

program.on('command:*', function(args) {
  // runs: clap projectName
  // shortcut for clap example basic projectName
  clapi.clap(DEFAULT_EXAMPLE, args[0]);
});

// start program
program.parse(process.argv);

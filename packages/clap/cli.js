#!/usr/bin/env node
// \\ CLAP => Create Lattice App \\

var program = require('commander');
var clapi = require('./lib');
var pkg = require('./package.json');

var DEFAULT_EXAMPLE = (exports.DEFAULT_EXAMPLE = 'basic');

program.version(pkg.version).usage('[options] command').description(pkg.description);

program
  .command('example <exampleName> <projectName>')
  .alias('e')
  .description(clapi.messages.describeClap())
  .option('-b, --branch <branch>', clapi.messages.helpClapBranch())
  .action(clapi.clap);

program
  .command('list')
  .alias('ls')
  .description(clapi.messages.describeList())
  .option('-b, --branch <branch>', clapi.messages.helpListBranch())
  .action(clapi.list);

if (!process.argv.slice(2).length) {
  program.help();
}

program.on('command:*', function (args) {
  // runs: clap projectName
  // shortcut for clap example basic projectName
  clapi.clap(DEFAULT_EXAMPLE, args[0]);
});

// start program
program.parse(process.argv);

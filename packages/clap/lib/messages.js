// \\ CLAP output messages \\
const chalk = require('chalk');
const ora = require('ora');

/**
 * Message function for describing project name is required
 *
 * @return {string} describing project name is required
 *
 */
exports.missingProjectName = function missingProjectName() {
  return `${chalk.red('error:')} please specify the project name.
    Eg:
      $ clap <projectName>
  `;
};

exports.alreadyExists = function alreadyExists() {
  return `${chalk.red('error:')} project name already exists.`;
};

exports.error = function error(msg) {
  return `${chalk.red(msg)}`;
};

exports.describeClap = function describeClap() {
  return `
    ${chalk.cyan('download and bootstrap `exampleName` into your upcoming lattice project.')}
    Eg:
      $ clap --example enterprise-demo myLatticeApp
  `;
};

exports.runningClap = function runningClap() {
  return `${chalk.green('Creating your upcoming lattice project!')}`;
};

exports.clapSucceed = function clapSucceed(project) {
  return `${chalk.green('Your lattice project is ready!')}
    Next steps:
      - ${chalk.cyan(`cd ${project}`)}
      - ${chalk.cyan('npm start')}

    Have a nice day!
  `;
};

exports.createDir = function createDir() {
  return `${chalk.green('Creating project directory...')}`;
};

exports.downloadExample = function downloadExample() {
  return `${chalk.green('Downloading lattice example...')}`;
};

exports.installDeps = function installDeps() {
  return `${chalk.green('Installing deps...')}`;
};

exports.wait = function wait(message) {
  var spinner = ora(message);
  spinner.color = 'blue';
  spinner.start();
  return spinner;
};

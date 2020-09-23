// \\ CLAP output messages \\
const chalk = require('chalk');
const ora = require('ora');

/**
 * Message function for describing project name is required
 *
 * @return {string} describing project name is required
 *
 */
function missingProjectName() {
  return `${chalk.red('error:')} please specify the project name.
    Eg:
      $ clap <projectName>
  `;
};

function alreadyExists() {
  return `${chalk.red('error:')} project name already exists.`;
};

function error(msg) {
  return `${chalk.red(msg)}`;
};

function describeClap() {
  return `
    ${chalk.cyan('download and bootstrap `exampleName` into your upcoming lattice project.')}
    Eg:
      $ clap example exampleName myLatticeApp
      $ clap example --branch=someBranch exampleName myLatticeApp
  `;
};

function helpClapBranch() {
  return 'download example from a branch (https://github.com/latticejs/lattice/branches).';
};

function runningClap() {
  return `${chalk.green('Creating your upcoming lattice project!')}`;
};

function clapSucceed(project) {
  return `${chalk.green('Your lattice project is ready!')}
    Next steps:
      - ${chalk.cyan(`cd ${project}`)}
      - ${chalk.cyan('npm start')}

    Have a nice day!
  `;
};

function createDir() {
  return `${chalk.green('Creating project directory...')}`;
};

function downloadExample() {
  return `${chalk.green('Downloading lattice example...')}`;
};

function installDeps() {
  return `${chalk.green('Installing deps...')}`;
};

function wait(message) {
  var spinner = ora(message);
  spinner.color = 'blue';
  spinner.start();
  return spinner;
};

function listExamples() {
  return chalk.green('Lattice example projects: ');
};

function describeList() {
  return `
    ${chalk.cyan('list all the available lattice example projects.')}
  `;
};

function helpListBranch() {
  return 'list examples from a branch (https://github.com/latticejs/lattice/branches).';
};

function checkValidExample() {
  return chalk.green('Validating example...');
};

function renamePkgName() {
  return chalk.green('Renaming package.json name...');
};

export default {
  renamePkgName: renamePkgName,
  checkValidExample: checkValidExample,
  helpListBranch: helpListBranch,
  describeList: describeList,
  listExamples: listExamples,
  wait: wait,
  installDeps: installDeps,
  downloadExample: downloadExample,
  createDir: createDir,
  clapSucceed: clapSucceed,
  runningClap: runningClap,
  helpClapBranch: helpClapBranch,
  describeClap: describeClap,
  error: error,
  alreadyExists: alreadyExists,
  missingProjectName: missingProjectName
};
// \\ CLAP API \\
var fs = require('fs');
var messages = require('./messages');
var tasks = require('./tasks');
var createDir = tasks.createDir;
var downloadExample = tasks.download;
var installDeps = tasks.install;
var listExamples = tasks.list;

function taskFailed(taskSpinner, err) {
  taskSpinner.fail(messages.error(err.message ? err.message : err));
  process.exit(1);
}

async function clap(example, project) {
  // project name is missing -> abort
  if (!project) {
    console.log(messages.missingProjectName());
    process.exit(1);
  }
  // project dir already exists -> abort
  if (fs.existsSync(project) && project !== '.') {
    console.log(messages.alreadyExists(project));
    process.exit(1);
  }

  // Tasks:
  // - create project dir
  // - download and untar example from lattice gh repo
  // - install everything
  // - tell user job ended succesfully (and follow steps?)
  console.log(messages.runningClap());

  try {
    var createDirSpinner = messages.wait(messages.createDir());
    var createDirOut = await createDir(project);
    if (createDirOut.code) {
      taskFailed(createDirSpinner, createDirOut.stderr);
    }
    createDirSpinner.succeed();

    var downloadSpinner = messages.wait(messages.downloadExample());
    var downloadExampleOut = await downloadExample(project, example);
    if (downloadExampleOut.code) {
      taskFailed(downloadSpinner, downloadExampleOut.stderr);
    }
    downloadSpinner.succeed();

    var installSpinner = messages.wait(messages.installDeps());
    var projectPath = `${process.cwd()}/${project}`;
    var installDepsOut = await installDeps(projectPath);
    if (installDepsOut.code) {
      taskFailed(installSpinner, installDepsOut.stderr);
    }
    installSpinner.succeed();
  } catch (err) {
    messages.error(err.message);
    process.exit(1);
  }
  console.log(messages.clapSucceed(project));
}

async function list() {
  // Tasks:
  //   - get examples (gh content api)
  //   - parse
  //   - display examples

  console.log(messages.listExamples());
  var repoOptions = {
    owner: 'latticejs',
    repo: 'lattice',
    path: 'examples',
    ref: 'master'
  };

  var parseList = function parseList(listRawItem) {
    if (listRawItem.name === 'README.md') return;
    console.log(`- ${listRawItem.name}`);
  };

  try {
    var examplesRaw = await listExamples(repoOptions);
    examplesRaw.data.forEach(parseList);
  } catch (err) {
    console.error(messages.error(err));
    process.exit(1);
  }
}

// exported
module.exports = {
  clap: clap,
  list: list,
  messages: messages
};

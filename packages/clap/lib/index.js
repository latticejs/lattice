// \\ CLAP API \\
var fs = require('fs');
var messages = require('./messages');
var tasks = require('./tasks');

// \ Lattice repo data \
var repoOptions = {
  owner: 'latticejs',
  repo: 'lattice',
  path: 'examples',
  ref: 'master'
};

function extractMessage(err) {
  var msg = '';
  try {
    msg = JSON.parse(err.message).message;
  } catch (error) {
    msg = err.message ? err.message : err;
  }

  return msg;
}

function taskFailed(taskSpinner, err) {
  taskSpinner.fail(messages.error(extractMessage(err)));
  process.exit(1);
}

async function clap(example, project, cmd) {
  var branch = null;

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

  if (cmd.branch) {
    branch = cmd.branch;
    repoOptions.ref = cmd.branch;
  }

  // Tasks:
  // - create project dir
  // - download and untar example from lattice gh repo
  // - install everything
  // - tell user job ended succesfully (and follow steps?)
  console.log(messages.runningClap());

  // all the tasks follow the same structure.
  // in case of error the output has the following shape:
  // {
  //   code: 1,
  //   stderr: error message
  // }
  // in case of success,
  // {
  //   code: 0
  // }
  try {
    // \ validate example name
    var checkValidExampleSpinner = messages.wait(messages.checkValidExample());
    var checkValidExampleOut;
    try {
      checkValidExampleOut = await tasks.validate(repoOptions, example);
    } catch (error) {
      checkValidExampleOut = error;

      if (/^(No commit found)/.test(extractMessage(checkValidExampleOut.stderr))) {
        checkValidExampleOut.stderr.message = `The branch "${
          cmd.branch
        }" does not exist on Lattice repo. Please see https://github.com/latticejs/lattice/branches.`;
      }
    }

    if (checkValidExampleOut.code) {
      taskFailed(checkValidExampleSpinner, checkValidExampleOut.stderr);
    }

    checkValidExampleSpinner.succeed();

    // \ create project directory
    var createDirSpinner = messages.wait(messages.createDir());
    var createDirOut = await tasks.createDir(project);
    if (createDirOut.code) {
      taskFailed(createDirSpinner, createDirOut.stderr);
    }
    createDirSpinner.succeed();

    // \ download example
    var downloadSpinner = messages.wait(messages.downloadExample());
    var downloadExampleOut = await tasks.download(project, example, branch);
    if (downloadExampleOut.code) {
      taskFailed(downloadSpinner, downloadExampleOut.stderr);
    }
    downloadSpinner.succeed();

    // \ rename pkg name
    var renamePkgNameSpinner = messages.wait(messages.renamePkgName());
    var renamePkgNameOut = await tasks.rename(project);
    if (renamePkgNameOut.code) {
      taskFailed(renamePkgNameSpinner, renamePkgNameOut.stderr);
    }
    renamePkgNameSpinner.succeed();

    // \ install deps
    var installSpinner = messages.wait(messages.installDeps());
    var projectPath = `${process.cwd()}/${project}`;
    var installDepsOut = await tasks.install(projectPath);
    if (installDepsOut.code) {
      taskFailed(installSpinner, installDepsOut.stderr);
    }

    // \ succeed \o/
    installSpinner.succeed();
  } catch (err) {
    messages.error(err.message);
    process.exit(1);
  }
  console.log(messages.clapSucceed(project));
}

async function list(cmd) {
  // Tasks:
  //   - get examples (gh content api)
  //   - parse
  //   - display examples

  if (cmd.branch) {
    repoOptions.ref = cmd.branch;
  }

  console.log(messages.listExamples());

  var parseList = function parseList(listRawItem) {
    if (listRawItem.name === 'README.md') return;
    console.log(`- ${listRawItem.name}`);
  };

  try {
    var examplesRaw = await tasks.list(repoOptions);
    examplesRaw.data.forEach(parseList);
  } catch (err) {
    if (/^(No commit found)/.test(extractMessage(err))) {
      err.message = `The branch "${
        cmd.branch
      }" does not exist on Lattice repo. Please see https://github.com/latticejs/lattice/branches.`;
    }

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

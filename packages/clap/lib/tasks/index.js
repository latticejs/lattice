import validate from './validateExampleName';
import createDir from './createDir';
import download from './downloadExample';
import install from './installDeps';
import list from './listExamples';
import rename from './renamePkgName';

export default {
  validate: validate,
  createDir: createDir,
  download: download,
  install: install,
  list: list,
  rename: rename,
};

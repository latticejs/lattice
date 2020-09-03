module.exports = {
  validate: require('./validateExampleName'),
  createDir: require('./createDir'),
  download: require('./downloadExample'),
  install: require('./installDeps'),
  list: require('./listExamples'),
  rename: require('./renamePkgName'),
};

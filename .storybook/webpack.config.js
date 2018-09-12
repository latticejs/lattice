module.exports = (config) => {
  config.module.rules[0].exclude = /node_modules/;

  return config;
}

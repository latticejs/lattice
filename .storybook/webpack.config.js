module.exports = config => {
  config.module.rules.push({
    test: /\.jsx?$/,
    include: /packages\/((?!node_modules).)*\/stories\/[^\/]+\.js$/,
    loader: require.resolve("@storybook/addon-storysource/loader"),
    enforce: "pre"
  });

  return config;
};

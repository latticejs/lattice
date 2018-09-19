const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('./stories'),
        loaders: [require.resolve('@storybook/addon-storysource/loader')],
        enforce: 'pre',
      },
    ],
  },
};

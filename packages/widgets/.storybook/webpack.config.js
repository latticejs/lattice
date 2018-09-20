const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('./stories'),
        loaders: [require.resolve('@storybook/addon-storysource/loader')],
        options: { prettierConfig: { parser: 'babylon' } },
        enforce: 'pre'
      }
    ]
  }
};

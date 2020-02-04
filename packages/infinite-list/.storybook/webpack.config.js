const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('./stories'),
        loader: require.resolve('@storybook/source-loader'),
        options: { prettierConfig: { parser: 'babel' } },
        enforce: 'pre'
      }
    ]
  }
};

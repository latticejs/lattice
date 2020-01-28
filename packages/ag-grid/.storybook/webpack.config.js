const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve('./stories'),
        loader: require.resolve('@storybook/source-loader'),
        options: { prettierConfig: { parser: 'babylon' } },
        enforce: 'pre'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};

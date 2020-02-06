module.exports = config => {
  config.module.rules[0].exclude = /node_modules/;

  config.module.rules.push({
    test: /\.jsx?$/,
    include: /packages\/((?!node_modules).)*\/stories\/[^\/]+\.js$/,
    loader: require.resolve('@storybook/addon-storysource/loader'),
    options: {
      prettierConfig: {
        parser: 'babylon'
      }
    },
    enforce: 'pre'
  },
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/'
        }
      }
    ]
  }
  );

  return config;
};

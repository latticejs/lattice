module.exports = [
  {
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.(ttf|eot|otf|svg|png)$/, loader: 'file-loader' }
      ]
    },
    resolve: {
      alias: {
        '@material-ui/core': '@material-ui/core/es'
      }
    },
    entry: './src/client',
    output: {
      path: `${__dirname}/public`
    }
  },
  {
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        { test: /\.(ttf|eot|otf|svg|png)$/, loader: 'file-loader' }
      ]
    },
    resolve: {
      alias: {
        '@material-ui/core': '@material-ui/core/es'
      }
    },
    entry: './src/server',
    target: 'node'
  }
];

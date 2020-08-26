const nodeExternals = require('webpack-node-externals');

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
        '@material-ui/core/es': '@material-ui/core/es'
      }
    },
    entry: './src/client',
    output: {
      path: `${__dirname}/public`
    },
    performance : {
      hints : false
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
        '@material-ui/core/es': '@material-ui/core/es'
      }
    },
    entry: './src/server',
    target: 'node',
    externals: [nodeExternals()],
    performance : {
      hints : false
    }
  }
];

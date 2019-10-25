import path from 'path';
import webpack from 'webpack';
import Visualizer from 'webpack-visualizer-plugin';

const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './src/index.html'
});

module.exports.dev = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/index.js',
    output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js'
  },
  devServer: {
        contentBase: './src'
  },
    optimization: {
        minimizer: [
      new UglifyJsPlugin({
                cache: true,
        parallel: true,
                sourceMap: false,
        uglifyOptions: {
          warnings: false,
                    comparisons: false,
                    dead_code: true,
          inline: 1,
                    unsafe_comps: true,
                    toplevel: true,
                    drop_debugger: true,
                    conditionals: true,
          evaluate: true,
          drop_console: true,
                    sequences: true,
                    booleans: true,
                    output: {
            ecma: 6,
            comments: false,
                        ascii_only: true
          }
        }
      }),
            new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
      // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css'
    }),
        new CompressionPlugin({
      test: /\.js/
    }),
    htmlPlugin,
    new Visualizer()
  ]
};

module.exports.prod = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js',
        chunkFilename: '[name].js'
  },
  devServer: {
        contentBase: './src'
  },
    performance: { hints: false },
  optimization: {
    concatenateModules: true,
        minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
                uglifyOptions: {
                    warnings: false,
                    comparisons: false,
                    dead_code: true,
          inline: 1,
          unsafe_comps: true,
          toplevel: true,
                    drop_debugger: true,
                    conditionals: true,
          evaluate: true,
                    drop_console: true,
                    sequences: true,
                    booleans: true,
                    output: {
                        ecma: 6,
            comments: false,
            ascii_only: true
          }
        }
      }),
            new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
      },
      {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
      },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
    plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
            chunkFilename: '[id].css'
    }),
        new CompressionPlugin({
      test: /\.js/
    }),
    htmlPlugin,
        new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin({
            asset: '[path].gz[query]',
      algorithm: 'gzip',
            test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
            minRatio: 0.8
    }),
    new Visualizer()
  ]
};

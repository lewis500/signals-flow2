var path = require('path');
var webpack = require('webpack');
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = {
  // devtool: 'eval',
  devtool: "#inline-source-map",
  entry: [
    'webpack-dev-server/client?http://localhost:3030',
    './app/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new WebpackBuildNotifierPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'app')
    }, {
      test: /\.scss$/,
      loaders: ["style", "css", "sass" ]
    }, {
      test: /\.css$/,
      loaders: ["style", "css"]
    }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css', '.json']
  }
};

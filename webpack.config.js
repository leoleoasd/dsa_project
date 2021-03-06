const path = require('path');
const _$htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: 'app.js',
  },
  devtool: 'source-map',
  devServer: {
    port: 9090,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new _$htmlWebpackPlugin({
      title: '飞机模拟系统',
      filename: 'index.html',
      template: 'public/index.html',
    }),
    new ESLintPlugin({
      extensions: ['ts'],
      context: 'src',
      emitError: true,
      // emitWarning: true,
      failOnError: true,
      quiet: true,
      // failOnWarning: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader',
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },
};

const path = require('path');
const _$htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: 'app.js'
    },
    devtool: "source-map",
    devServer:{
        port:9090
    },
    plugins: [
        new _$htmlWebpackPlugin({
            title: "飞机模拟系统",
            filename: "index.html",
            template: "public/index.html"
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader', 'css-loader'
                ]
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
                loader: 'babel-loader'
            }
        ]
    }
}

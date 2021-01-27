// require('dotenv').config()
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

var API_URL = {
    production: JSON.stringify('wss://tic-metac-toe-api.herokuapp.com/'),
    development: JSON.stringify('ws://localhost:8000')
};

var environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
console.log(process.env.NODE_ENV)

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry:
    {
        index: './src/index.js',
        sw: './src/sw.js'
    },
    output: {
        path: path.resolve('public'),
        filename: '[name].js'
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
            { test: /\.svg$/, loader: 'svg-url-loader' }
        ]
    },
    plugins: [
        HtmlWebpackPluginConfig,
        new CleanWebpackPlugin(),
        new DefinePlugin({
            'API_URL': API_URL[environment]
        })
    ]
}
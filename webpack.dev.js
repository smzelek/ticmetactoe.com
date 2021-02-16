const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { DefinePlugin } = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './public',
    },
    plugins: [
        new DefinePlugin({ 'API_URL': JSON.stringify('http://localhost:8000') })
    ]
});
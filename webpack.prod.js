const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { DefinePlugin } = require('webpack');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new DefinePlugin({'API_URL': JSON.stringify('wss://api.ticmetactoe.com')})
    ]
});
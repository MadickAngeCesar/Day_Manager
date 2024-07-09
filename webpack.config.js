const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: isDev ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]'
                }
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            "fs": false,
            "path": require.resolve("path-browserify")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', // ensure it outputs as index.html
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public', to: '', globOptions: { ignore: ['**/index.html'] } } // copies everything except index.html
            ]
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000
    },
    devtool: isDev ? 'eval-source-map' : 'source-map'
};

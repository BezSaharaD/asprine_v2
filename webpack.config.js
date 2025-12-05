const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const pkg = require('./package.json');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';
    
    return {
        entry: {
            'app': path.resolve(__dirname, 'src/js/app.js'),
            'db': path.resolve(__dirname, 'src/js/db.js'),
            'ui': path.resolve(__dirname, 'src/js/ui.js'),
            'cli': path.resolve(__dirname, 'src/js/cli.js'),
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/[name].js',
            chunkFilename: 'js/[name]_[chunkhash:8].js',
            clean: true,
        },
        // Disable cache to avoid stale chunk references
        cache: false,
        plugins: [
            new webpack.DefinePlugin({
                __VERSION__: JSON.stringify(pkg.version),
                __DEVEL__: JSON.stringify(isDev),
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
                chunkFilename: 'css/[name]_[chunkhash:8].css',
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                scriptLoading: 'blocking',
                hash: true,
                inject: false,
                title: 'Genshin Impact Calculator',
                template: 'src/index.ejs',
                templateParameters: {
                    'version': pkg.version,
                },
                excludeChunks: ['cli'],
            }),
            new CopyPlugin({
                patterns: [
                    {from: path.resolve(__dirname, 'src/images/stonks.jpg'), to: "images/share.jpg"},
                    {from: path.resolve(__dirname, 'src/images/favicon.png'), to: "images/favicon.png"},
                    {from: path.resolve(__dirname, 'src/images/help/'), to: "images/help/"},
                    {from: path.resolve(__dirname, 'src/help/'), to: "help/"},
                    {from: path.resolve(__dirname, 'src/js/lang/'), to: "js/lang/"},
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                },
                // Use asset modules instead of file-loader for fonts
                {
                    test: /\.(ttf|woff2?)$/,
                    include: /fonts/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]',
                        publicPath: '../',
                    }
                },
                // Use asset modules for images
                {
                    test: /\.(png|svg|jpe?g|gif|webp)$/,
                    include: /images/,
                    type: 'asset/resource',
                    generator: {
                        filename: (pathData) => {
                            const filepath = pathData.filename;
                            const relativePath = filepath.replace(/^.*?[\/\\]src[\/\\]images[\/\\]/, '').replace(/\\/g, '/');
                            return `images/${relativePath}`;
                        },
                        publicPath: '../',
                    }
                },
                {
                    test: /\.m?jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            assumptions: {
                                iterableIsArray: true,
                            },
                            presets: [
                                '@babel/preset-react',
                            ],
                        },
                    },
                },
            ],
        },
        resolve: {
            extensions: ['', '.js', '.jsx'],
        },
        optimization: {
            chunkIds: 'deterministic',
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin({
                    test: /\.js(\?.*)?$/i,
                    parallel: true,
                    terserOptions: {
                        compress: {
                            drop_console: !isDev,
                        },
                    },
                }),
            ],
            // Disable code splitting to keep simple bundle structure
            splitChunks: false,
        },
        // Performance hints
        performance: {
            hints: isDev ? false : 'warning',
            maxAssetSize: 512000,
            maxEntrypointSize: 512000,
        },
        devtool: isDev ? 'eval-source-map' : false,
    };
};

//require("@babel/polyfill"); 或者在下面的配置中使用 useBuiltIns：'usage'

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

//压缩js
const TerserJSPlugin = require('terser-webpack-plugin');
// 抽离style为link的css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩　css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const Webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

console.log(path.resolve(__dirname, 'src'))

module.exports = {
    mode: "development",//默认两种模式 production,development
    entry: {
        app: './src/index.js',
        print: './src/js/print.js'
    },
    devtool: 'cheap-module-eval-source-map',//前台报错可以直接查看到哪个文件报错
    devServer: {//开发环境下
        contentBase: path.join(__dirname, "dist"),//静态服务文件夹
        compress: true,
        port: 8080,
        proxy: {
            /*'api':{
             target:'http://localhost:3000',
             pathRewrite:{'/api':''}//可以过滤api前缀
             }*/
        }
    },
    output: {
        filename: 'js/[name]-[hash:8].bundle.js',
        path: path.resolve(__dirname, 'dist'),//路径必须是一个绝对路径
        publicPath: "/"
    },
    watch: true,//监控代码 只要有代码改动就打包 npm run build
    watchOptions: {
        poll: 1000, //每秒问我 1000次
        aggregateTimeout: 500, //500ms内只打包一次 防抖
        ignored: /node_modules/
    },
    resolve: {//解析第三方模块
        modules: [path.resolve('node_modules')],
        extensions: ['.js', '.css', '.scss', '.less', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            //eslint 可以打开
            /*{
             test:/\.js$/,
             include:path.resolve(__dirname,'src'),
             use:{
             loader:'eslint-loader',
             options:{
             enforce:'pre'//在js babel-loader前面执行
             }
             }
             },*/
            /*内联loader全局暴露*/
            /*{
             test:require.resolve('jquery'),
             use:'expose-loader?$'
             },*/
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {//es6 转化为es5
                        presets: [['@babel/preset-env', {
                            corejs: '2.0',
                            useBuiltIns: 'usage'
                        }],
                            '@babel/preset-react'
                        ],
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',//解析css之前就加上前缀
                    'less-loader'
                ]
            },
            {
                test: /\.scss/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',//解析css之前就加上前缀
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 200 * 1024,// 超过这个用　file-loader 生成真正的图片,否则用url-loader
                        outputPath: 'img/',
                        //publicPath:"http://xxx" //单独给图片加publicPath
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1,// 超过这个用　file-loader 生成真正的图片,否则用url-loader
                        outputPath: 'fonts/'
                    }
                }
            },
            {
                test: /\.(csv|tsv)$/,
                use: ['csv-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            }
        ]
    },
    externals: {
        jquery:'$' //忽略 不打包这个 , 在外面cdn引入的情况
    },
    plugins: [
        new CleanWebpackPlugin(),
        //环境定义
        new Webpack.DefinePlugin({
            DEV: "'dev'" //在全局都可以使用DEV这个环境变量了
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name]-[hash:8].css'
        }),
        new Webpack.ProvidePlugin({
            $: 'jquery' //在每个模块中都注入 $
        }),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            hash: true,
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency',
            chunks: ['app'] // 引入的代码块
        }),
        new CopyPlugin([
            {from: './static', to: './static'}
        ]),
        //版权声明 webpack内置插件
        new Webpack.BannerPlugin('make 2019 by polyna')
    ],//用于生产的
    optimization: {
        //用了optimize-css-assets-webpack-plugin这个插件就必须用js压缩插件,否则js不会被压缩
        minimizer: [
            new TerserJSPlugin({
                cache: true,
                parallel: true,//是否是并发打包的
                sourceMap: true,//源码映射
                exclude: /\/node_modules/
            }),
            new OptimizeCSSAssetsPlugin({})],
    },
};


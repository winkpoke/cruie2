/**
 * Created by miyaye on 2020/4/4.
 */
/**
 * Created by miyaye on 2020/4/4.
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const publicAssetPath ='./static'
// 抽离style为link的css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const Webpack = require('webpack');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        app: './src/main.js',
        //bootstrap:"./bootstrap.js"
    },
    output: {
            filename: `${publicAssetPath}/js/[name]-[hash:8].bundle.js`,
            path: path.resolve(__dirname, '../dist'),//路径必须是一个绝对路径
    },
    resolve:{//解析第三方模块
        /*modules:[path.resolve('node_modules')],
         extensions:['.js','.css','.scss','.less','.json','.jsx'],*/
        alias:{
            '@': path.resolve(__dirname, '../src')
        }
    },
    mode: "development",
    module:{
      rules:[
          {
              test:/\.js|\.jsx$/,
              include:[path.resolve(__dirname,'../')],
              exclude:/node_modules/,
              use:{
                  loader:'babel-loader',
                  options:{//es6 转化为es5
                      presets:[ ['@babel/preset-env',{
                          corejs: '2.0',
                          useBuiltIns:'usage'
                      }],'@babel/preset-react'],
                      plugins:["@babel/plugin-transform-runtime",
                          ["@babel/plugin-proposal-decorators", { "legacy": true }],
                          ["@babel/plugin-proposal-class-properties", { "loose": true }],
                          ["import", {"libraryName": "antd", "libraryDirectory": "es"},'ant'],
                          ["import", {"libraryName": "lodash", "libraryDirectory": "", "camel2DashComponentName":false},'lodash'],
                          ["import", {"libraryName": "jquery", "libraryDirectory": "", "camel2DashComponentName":false},'jquery'],
                      ]
                  }
              }
          },
          {
              test: /\.css$/,
              //exclude:/node_modules/,
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
          },
          {
              test: /\.less/,
              exclude:/node_modules/,
              use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'postcss-loader',//解析css之前就加上前缀
                  'less-loader'
              ]
          },
          {
              test: /\.scss/,
              exclude:/node_modules/,
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
                  loader:'url-loader',
                  options:{
                      limit:200*1024,// 超过这个用　file-loader 生成真正的图片,否则用url-loader
                      outputPath:'img/',
                      //publicPath:"http://xxx" //单独给图片加publicPath
                  }
              }
          },
          {
              test: /\.(woff|woff2|eot|ttf|otf)$/,
              use: {
                  loader:'url-loader',
                  options:{
                      limit:1,// 超过这个用　file-loader 生成真正的图片,否则用url-loader
                      outputPath:'fonts/'
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
    optimization: {
        splitChunks:{
            cacheGroups:{
                //公共的模块
                common:{
                    chunks:'initial',
                    name:'common',
                    minSize:0,
                    minChunks:2,
                },
                //抽离第三方模块
                vendor:{
                    priority:1,
                    name:'vendor',
                    test:/node_modules/,
                    chunks:'initial',
                    minSize:30000,
                    reuseExistingChunk: true // 可设置是否重用该chunk
                },
            }
        },
        //用了optimize-css-assets-webpack-plugin这个插件就必须用js压缩插件,否则js不会被压缩
        minimizer: [
            new TerserJSPlugin({
                cache:true,
                parallel:true,//是否是并发打包的
                sourceMap:true,//源码映射
                exclude:/\/node_modules/,
                terserOptions: {
                    warnings: false,
                    output: {
                        comments: false,
                    },
                    extractComments: false,
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `${publicAssetPath}/css/[name]-[hash:8].css`
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            comments: false,
            chunksSortMode: 'dependency',
            chunks: ['app','bootstrap','common','vendor'] // 引入的代码块
        }),
        new CopyWebpackPlugin(['index.html'])
    ],
};

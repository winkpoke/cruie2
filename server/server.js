const express = require('express');
const app = express();
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
let webpack = require('webpack');
let middle = require('webpack-dev-middleware');
let config =  require('../build/webpack.dev')  ;
let compiler = webpack(config);
app.use(middle(compiler));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const prefix = '/curie-api/';

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

const userRouter = require('../router/user');
const pageCRouter = require('../router/pageC');
const categoryRouter = require('../router/category');
const pageData = require('../router/pageData');
const attrRouter = require('../router/attr');

app.use( '/user', userRouter);

/*app.use('/pageC', pageCRouter);
app.use('/pageData', pageData);
app.use('/cat', categoryRouter);
app.use('/attr', attrRouter);*/


app.get('/api/user',(req,res)=>{
    res.json({name:'珠峰架构'})
});

var port = 3000;
app.listen(port,function () {
    console.log('http server started at: http://localhost:'+port)
});

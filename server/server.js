const express = require('express');
const app = express();
var cookieParser = require('cookie-parser'); //引用中间件
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
let webpack = require('webpack');
let middle = require('webpack-dev-middleware');
let config =  require('../build/webpack.dev')  ;
let compiler = webpack(config);
var jwt = require('jsonwebtoken');
app.use(middle(compiler));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());//设置中间件

const prefix = '/curie-api';

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.use(function(req, res, next){
    // 获取请求头中的Authorization认证字符
    //let authorization = req.get('Authorization');
    console.log('=================我是cookie:',req.cookies);
    let authorization = req.cookies.token;
    // 排除不需要授权的路由
    if(req.path === `${prefix}/user/login`){
        next()
    }else{
        let secretOrPrivateKey= "This is perfect projects.";
        jwt.verify(authorization, secretOrPrivateKey, function (err, decode) {
            if (err) {  //  认证出错
                res.status(403).send('认证无效，请重新登录。');
            } else {
                next();
            }
        })
    }
})

const userRouter = require('../router/user');
const pageCRouter = require('../router/pageC');
const categoryRouter = require('../router/category');
const pageData = require('../router/pageData');
const attrRouter = require('../router/attr');

app.use( prefix+'/user', userRouter);

/*app.use('/pageC', pageCRouter);
app.use('/pageData', pageData);
app.use('/cat', categoryRouter);
app.use('/attr', attrRouter);*/

app.get('/api/user',(req,res)=>{
    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
    res.json({name:'珠峰架构'})
});

var port = 3000;
app.listen(port,function () {
    console.log('http server started at: http://localhost:'+port)
});
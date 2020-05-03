const express = require('express');
const app = express();
var cookieParser = require('cookie-parser'); //引用中间件
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
let webpack = require('webpack');
let middle = require('webpack-dev-middleware');
const config = require('../config')
let webpackConfig =  require('../build/webpack.wasm');
let compiler = webpack(webpackConfig);
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

const server = require('http').createServer(app);
const io = require('socket.io')(server);
require('./socketFuncs')(io)

/*io.on('connection', (socket) => {
    console.log('a user connected');
    socket.disconnect(true);
    //服务端关闭
    //setTimeout(() => socket.disconnect(true), 5000);
    socket.on('aaa',function (msg) {
        io.emit('chunk',msg);
        //console.log('接受chunk:',msg);
    });
    socket.on('aaa end',function () {
        io.emit('chunk end',msg);
        //console.log('接受chunk:',msg);
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        console.log('来自客户端:message: ' + msg);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
        socket.disconnect(true);
    });
});*/

app.use(function(req, res, next){

    // 获取请求头中的Authorization认证字符
    let token = req.get('token');
    //console.log('=================我是token:',token);
    //console.log('=================我是cookie:',req.cookie);
    let authorization = req.cookies.token || token ;
    console.log('authorization',authorization)
    // 排除不需要授权的路由
     if(req.path === `${prefix}/user/login` || req.path === `${prefix}/user/signup` || req.path.indexOf('static') > 0){
        next()
    }else{
         jwt.verify(authorization, config.jwtsecret, function (err, decode) {
            if (err) {  //  认证出错
                res.status(403).send('认证无效,请重新登录:'+err.message);
            } else {
                next();
            }
        })
    }
});

console.log(config)

const userRouter = require('../router/user');
const patientRouter = require('../router/patient');
app.use( prefix+'/user', userRouter);
app.use( prefix+'/patient', patientRouter);

app.get('/api/user',(req,res)=>{
    var date = new Date();
    var tomorrow = date.setDate(new Date().getDate() + 10);
    res.cookie('rememberme', '1', { expires: date});
    res.json({name:'test架构'})
});

var port = process.env.PORT || config.port;
server.listen(port,function () {
    console.log('http server started at: http://localhost:'+port)
});

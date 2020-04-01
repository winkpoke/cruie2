const utils = require('../utils/utils');
const {response} = utils;
const express = require('express');
const router = express.Router();
var User = require('../model/User');
var jwt = require('express-jwt');
import config from '../config'
/*用户注册*/
router.post('/sign',function (req,res) {
    console.log('==========================req.body',req.body);
    const {username,password} = req.body;
     //是否合法的参数
    if (username == null || username.trim() == '' || password == null || password.trim() == '') {
        res.json(response.err("用户名或密码不能为空"))
        return
    }
    //是否存在用户
    User.findOne({ username: username }).then((data) => {
        return new Promise((resolve, reject)=>{
            if (data) {
                res.json(response.err("用户已注册过"))
                reject()
            }
            else {
                resolve()
            }
        })
    }).then(() => {
       return new User({
            username: username,
            password: utils.md5(password)
        }).save();
    }).then((data)=>{
        if (data) {
            //返回 注册成功之后种cookie 并登录
            var token = utils.signtoken(({username: data.username}));
            res.cookie('token', token, config.jwtExpire, true);
            res.json(response.succ('注册成功'));
        }
        //返回
        res.json(response.err("注册失败"))
    }).catch((err)=>{
        console.log(333,err.message)
        //异常
        if (err) {
            res.json(response.err(err.message))
        }
    })
});

/*用户登录*/
router.post('/login', function(req, res) {
    var username = req.body.username
    var password = req.body.password

    //是否合法的参数
    if (username == null || username.trim() == '' || password == null || password.trim() == '') {
        res.json(response.err("用户名或密码不能为空"))
        return
    }

    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.json(response.err('未找到授权用户'));
        } else if (user) {
            if (user.password != utils.md5(req.body.password)) {
                res.json(response.err('用户密码错误'));
            } else {
                var token = utils.signtoken({username:user.username});
                res.cookie('token', token, config.jwtExpire, true);
                res.json(response.succ(token));
            }
        }
    });
});

router.get('/protected',
    jwt({secret: 'shhhhhhared-secret'}),
    function(req, res) {
        console.log(res.user)
        if (!req.user.admin) return res.sendStatus(401);
        res.sendStatus(200);
    });

/*获取当前用户*/
router.get('/getUser', function (req, res) {
    res.send('hello, ' + req.body.username)
});

router.get('/:name', function (req, res) {
    res.send('hello, ' + req.params.name)
});

module.exports = router;

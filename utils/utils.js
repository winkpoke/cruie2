var config = require('../config')
var jwt = require('jsonwebtoken')
var md5 = require('md5')

var signtoken = function(obj){
    return jwt.sign(obj, config.jwtsecret, { expiresIn: config.jwtExpire });
}

var verifytoken = function(token){
    return new Promise((resolve, reject)=>{
        jwt.verify(token, config.jwtsecret, function(err,decoded){
            if(err){
                resolve(null)
            }
            else {
                resolve(decoded)
            }
        })
    })
}

var cmd5 = function(str){
    return md5(str+config.md5secret)
}

var ismail=function(mail){
    var filter = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
    if (filter.test(mail)){
        return true
    }
    else {
        return false
    }
}

var isphone = function(phone){
    if (String(phone).length == 11) {
        return true
    }
    else {
        return false
    }
}

var concatArrayBuffer = (arr)=>{
    var arr1 = [];
    arr.map((arrayBuffer,index)=>{
        arr1.push(Buffer.from(arrayBuffer));
        return arrayBuffer
    });
    return Buffer.concat(arr1)
}


module.exports = {
    signtoken:signtoken,
    verifytoken:verifytoken,
    md5:cmd5,
    ismail:ismail,
    isphone:isphone,
    concatArrayBuffer,
    response: {
        succ(data){return {code:0,message:'',data}},
        err(message){return {code:-1,message  }}
    }
}

const path = require('path');
const fs = require('fs');
const config = require('../config')
const _ = require('lodash');
var qs = require('qs');


var pump = require('pump');

const readFile = (params,ws) => {
    var {dcmDir,level , key,path:url,pid} = params;
    //res.setHeader('Transfer-Encoding', 'chunked');
    console.log(dcmDir,level , key, url,pid)
    var rawPath;
    if(level == 0){//如果是病人
        console.log('病人')
        rawPath = path.resolve(dcmDir , '../dcmRaw/data_dcm.raw.zip');
    }else if(level ==2){//如果是cbct
        //获取cbct下面的raw文件
        const files = _.without( fs.readdirSync(url) , '.DS_Store' );
        console.log('====rawFile====',files);
        rawPath = path.join(url ,'/', files[1]);
        console.log(rawPath)
    }

    var readStream = fs.createReadStream(rawPath);

    var i = 0;
    readStream.on('data',function (chunk) {
        // console.log('===new buffer:===',chunk);
        //res.write(chunk);
        i++;
        //ws.send('chunk', chunk);
        ws.send(chunk)
    });
    readStream.on('end',function () {
        console.log('i:', i)
        // ws.send('chunk end', {i,level,key,pid});
        var obj = {type:'end',i,level,key,pid}

        var buff = new TextEncoder().encode(JSON.stringify(obj));
        ws.send( JSON.stringify(obj) );
        console.log('读取结束');
        i = 0;
    })
}


module.exports = function(ws,req){
    let list = [];
        // const url = require('url');
        // const pathname = url.parse(req.url).pathname;
        list.push(ws);

        console.log('=====当前连接人数=====:', list.length);
        if(list.length > 1) {
            //ws.close()
        }
        let url = req.url;
        console.log('====url====:',url);

        /*客户端开始拿raw 数据*/
        ws.on('message',function (params) {
            console.log('接收到了客户端的参数:',params,url)
            var data = JSON.parse(params)
            console.log(data)
            switch (data.type) {
                case 'chunk':
                    readFile(data,ws)
                    break
                case 'aquire':
                    ws.send(JSON.stringify({msg: 'server received' + params}))
                    break;
                case 'autoRegisteration':
                    ws.send(JSON.stringify({msg: 'server received' + params}))
            }
        });


        ws.on('error', function (error) {
            console.log('错误' + error);
        });

        ws.on('open', function (e) {
            ws.send('open');
        });

        ws.on('close', function (e) {
            //_.pull(list, ws);
            // ws.close()
            console.log('在线人数' + list.length);
        })
        //require('../utils/watchFile')(ws)
}

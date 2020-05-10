const path = require('path');
const fs = require('fs');
const config = require('../config')
const _ = require('lodash');
var qs = require('qs');
var pump = require('pump');

const readFile = (params,ws) => {
    var {dcmDir,level , key,path:url,pid} = params;
    //res.setHeader('Transfer-Encoding', 'chunked');
    var rawPath;
    if(level == 0){//如果是病人
        rawPath = path.resolve(dcmDir , '../dcmRaw/data_dcm.raw.zip');
    }else if(level ==2){//如果是cbct
        //const {path:url} = req.body;
        //获取cbct下面的raw文件
        const files = _.without( fs.readdirSync(url) , '.DS_Store' );
        console.log('====rawFile====',files);
        rawPath = path.join(url ,'/', files[1]);
    }
    //console.log( path.resolve(dcmDir , '../dcmRaw/data_dcm.raw') );

    var readStream = fs.createReadStream(rawPath);

    // pump(source, dest, function(err) {
    //     console.log('pipe finished', err)
    // })

    var i = 0;
    readStream.on('data',function (chunk) {
        //console.log('===new buffer:===',chunk);
        //res.write(chunk);
        i++;
        //ws.send('chunk', chunk);
        ws.send(JSON.stringify({
            type: 'chunk',
            data: chunk
        }))
    });
    readStream.on('end',function () {
        // ws.send('chunk end', {i,level,key,pid});
        ws.send(JSON.stringify(
            {
                type:'chunk end',
                data: {i,level,key,pid}
            }
        ));
        console.log('读取结束');
        i = 0;
    })
}


module.exports = function(wss){
    let list = [];
    wss.on('connection', (ws, req) => {
        list.push(ws);

        console.log('=====当前连接人数=====:', list.length);
        if(list.length > 1) {
            ws.close()
        }
        let url = req.url;
        console.log('====url====:',url);
        // ws.on('message', function incoming(message) {
        //     console.log('received: %s', message);
        //     ws.send('server received' + message);
        // });

        /*客户端开始拿raw 数据*/
        ws.on('message',function (params) {
            params = JSON.parse(params)
            switch (params.type) {
                case 'chunk':
                    readFile(params,ws)
                    break
                case 'aquire':
                    ws.send('server received' + params)
                    break
                case 'autoRegisteration':
                    ws.send('server received' + params)
                    break

            }
        });


        ws.on('error', function (error) {
            console.log('错误' + error);
        });

        ws.on('open', function (e) {
            ws.send('open');
        });

        ws.on('close', function (e) {
            _.pull(list, ws);
            console.log('在线人数' + list.length);
        })
    })
}

const path = require('path');
const fs = require('fs');
const config = require('../config')
const _ = require('lodash');
module.exports = function(io){
    io.on('connection', (socket) => {
        io.emit('chat message', 'ssssss')

        /*客户端开始拿raw 数据*/
        socket.on('chunk',function (params) {
            var {dcmDir,level , key,path:url,pid} = params;
            //res.setHeader('Transfer-Encoding', 'chunked');
            var rawPath;
            if(level == 0){//如果是病人
                rawPath = path.resolve(dcmDir , '../dcmRaw/data_dcm.raw');
            }else if(level ==2){//如果是cbct
                //const {path:url} = req.body;
                //获取cbct下面的raw文件
                const files = _.without( fs.readdirSync(url) , '.DS_Store' );
                console.log('====rawFile====',files);
                rawPath = path.join(url ,'/', files[0]);
            }
            //console.log( path.resolve(dcmDir , '../dcmRaw/data_dcm.raw') );

            var readStream = fs.createReadStream(rawPath);
            var i = 0;
            readStream.on('data',function (chunk) {
                //console.log('===new buffer:===',chunk);
                //res.write(chunk);
                i++;
                socket.emit('chunk', chunk.toString('base64'));
            });
            readStream.on('end',function () {
                socket.emit('chunk end', {i,level,key,pid});
                console.log('读取结束');
                i = 0;
            })
        });


        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
            console.log('来自客户端:message: ' + msg);
        });
        socket.on('disconnect', function(){
            console.log('user disconnected');
            socket.disconnect(true);
        });
    })
}

const {response} = require('../utils/utils');
const express = require('express');
const router = express.Router();
const path = require('path');
var Model = require('../model/Patient');
var ModelFilePath = require('../model/FilePath');
const fs = require('fs');
const io = require('socket.io-client');
/*获取病人列表 并获取cbct路径*/
router.get('/list',async function (req,res) {
  var patients = await  Model.find().exec();

  var a =  patients.map(async item=> {
        var obj = {};
        const {_id,patientName,detail} = item;
        obj['title'] = patientName;
        obj['key'] = _id;
        obj['level'] = 0;
        obj['detail'] = detail;
        obj['children'] = await ModelFilePath
            .find({patientId: _id, type: "cbct"})
            .select('_id patientId pid name type path')
            .exec();

        obj['children'] = obj['children'].map(item1=>{
            var obj1 = {};
            const {_id,name,type,path:url} = item1;
            obj['dcmPath'] = path.resolve(url,'../dcm');
            obj1['title'] = name;
            obj1['key'] = _id;
            obj1['type'] = type;
            obj1['level'] = 2;
            obj1['path'] = url;
            obj1['detail'] = detail;
            return obj1;
        });
        return obj;
  });
  Promise.all(a).then(res1=>{
      res.json(response.succ(res1));
  })
});

router.get('/rawFile',function (req,res) {
    const socket = io('http://localhost:3003');

    res.setHeader('Transfer-Encoding', 'chunked');
    console.log( path.resolve(__dirname , '../static/a.raw') );
    var readStream = fs.createReadStream(path.resolve(__dirname , '../static/a.raw'));
    var i = 0;
    readStream.on('data',function (chunk) {
        console.log('===new buffer:===',chunk);
        //res.write(chunk);
        i++;
        socket.emit('aaa', chunk);
    });
    readStream.on('end',function () {
        socket.emit('aaa end', i);
        console.log('读取结束');
        res.end('读取结束');
    })
});

router.get('/raw',function (req,response) {
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.setHeader('Transfer-Encoding', 'chunked');

    var html =
        '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<title>Chunked transfer encoding test</title>' +
        '</head>' +
        '<body>';

    response.write(html);

    html = '<h1>Chunked transfer encoding test</h1>'

    response.write(html);

    // Now imitate a long request which lasts 5 seconds.
    setTimeout(function(){
        html = '<h5>This is a chunked response after 5 seconds. The server should not close the stream before all chunks are sent to a client.</h5>'

        response.write(html);

        // since this is the last chunk, close the stream.
        html =
            '</body>' +
            '</html';

        response.end(html);

    }, 5000);

    // this is another chunk of data sent to a client after 2 seconds before the
    // 5-second chunk is sent.
    setTimeout(function(){
        html = '<h5>This is a chunked response after 2 seconds. Should be displayed before 5-second chunk arrives.</h5>'

        response.write(html);

    }, 2000);
});

module.exports = router;

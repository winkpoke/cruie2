const {response} = require('../utils/utils');
const express = require('express');
const router = express.Router();
const path = require('path');
var Model = require('../model/Patient');
var ModelFilePath = require('../model/FilePath');
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
module.exports = router;

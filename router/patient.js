const {response} = require('../utils/utils');
const express = require('express');
const router = express.Router();
var Model = require('../model/Patient');
var ModelFilePath = require('../model/FilePath');
/*获取病人列表 并获取cbct路径*/
router.get('/list',async function (req,res) {
  var patients = await  Model.find().exec();

  var a =  patients.map(async item=> {
        var obj = {};
        const {_id,patientName} = item;
        obj['patientName'] = patientName;
        obj['_id'] = _id;
        obj['children'] = await ModelFilePath.find({patientId: _id, type: "cbct"}).select('_id patientId pid name type path').exec();
        return obj;
  });
  Promise.all(a).then(res1=>{
      res.json(response.succ(res1));
  })
});
module.exports = router;

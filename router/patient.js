const {response} = require('../utils/utils');
const express = require('express');
const router = express.Router();
var Model = require('../model/Patient');

/*获取病人列表*/
router.get('/list',function (req,res) {
    Model.find().exec().then(d=>{
        res.json(response.succ(d))
    });
    //res.json(response.succ());
});
module.exports = router;

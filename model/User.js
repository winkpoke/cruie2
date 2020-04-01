/** * 用户信息 */
var path = require("path");
const fileName = path.basename(__filename).split('.')[0];

var mongoose = require('../db.js'), Schema = mongoose.Schema;
var Sch = new Schema({
    username : { type: String }, //用户账号
    password: {type: String}, //密码
    clinic:{type:String},
    role:{type:String},
    memo:{type:String},
    logindate : { type: Date} //最近登录时间
});
module.exports = mongoose.model(fileName,Sch);

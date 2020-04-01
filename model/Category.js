/** * 用户信息 */
var mongoose = require('../db.js'),
    Schema = mongoose.Schema;
var sch = new Schema({
    title : { type: String }, //用户账号
    content: {type: String}, //密码
    create_time : { type: Date}, //最近登录时间
    updateTime : { type: Date}, //最近登录时间
    user:{type:String},
    pid:{type:Number}
});
module.exports = mongoose.model('Category',sch);
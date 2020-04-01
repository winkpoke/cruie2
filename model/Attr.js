/** * 用户信息 */
var mongoose = require('../db.js'),
    Schema = mongoose.Schema;
var sch = new Schema({
    name:{ type: String },
    type:{type:String},
    dict:{type:String},
    user:{type:String},
    create_time : { type: Date}, //最近登录时间
    updateTime : { type: Date}, //最近登录时间
});
module.exports = mongoose.model('Attr',sch);
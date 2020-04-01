/** * 用户信息 */
var mongoose = require('../db.js'),
    Schema = mongoose.Schema;
var sch = new Schema({
    title : { type: String },
    routeName:{type:String},
    routePath:{type:String},
    routeParams:{type:Object},
    desc : { type: String },
    cid : { type: Number },
    content: {type: String},
    config:{type:String},//页面配置
    create_time : { type: Date}, //最近登录时间
    updateTime : { type: Date}, //最近登录时间
    user:{type:String},
    category_id:{type:Number}
});
module.exports = mongoose.model('PageData',sch);
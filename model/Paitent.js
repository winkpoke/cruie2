/** * 用户信息 */
var mongoose = require('../db.js'), Schema = mongoose.Schema;
var Sch = new Schema({
    firstName:{type:String},
    lastName:{type:String},
    gender:{type:String},
    birthday:{type:String},
    signSymptom:{type:String},
    ct:{type:String},
    cbct:{type:String},
    plan:{type:String},
    physician:{type:String},

});
module.exports = mongoose.model('Patient',Sch);

/**
加入活动匹配表
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var uidActMatchSchema = new Schema({
	actId : {type: String},                      //活动Id
	timeOfJoin : {type: Date,default: Date.now},                    //时间
	acUid : {type: String}                       //用户ID
});

mongoose.model('uidActMatch', uidActMatchSchema);
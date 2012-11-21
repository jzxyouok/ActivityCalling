/**
用户反馈表
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
	fbId : {type: String},                    //反馈ID
	content : {type: String},                 //内容
	timeOfFb : {type: Date, default: Date.now},                  //反馈时间
	acUid : {type: String}                    //用户ID
});

mongoose.model('feedback', feedbackSchema);
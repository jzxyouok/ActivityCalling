/**
用户评论表
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	commentId : {type: String},                      //评论ID
	content : {type: String},                        //内容
	timeOfCom : {type: Date,default: Date.now},                        //时间
	acUid : {type: String},                           //用户Uid
	actId :{type: String}                             //活动Id
});

mongoose.model('comment', commentSchema);
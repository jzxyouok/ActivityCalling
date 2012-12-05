/**
活动信息表
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activitySchema = new Schema({
	actId : {type: String},                   //活动ID
	actName : {type: String} ,               //活动名称
	actContent : {type: String},              //活动内容
	actAddress : {type: String},               //活动地址
    actLongitude:{type:Number},                //地址经度
    actLatitude:{type:Number},                //地址纬度
    actCategory : {type: Number},		         //活动分类
	actLimitNum : {type: Number},                 //活动人数限制
	actStart : {type: Date},                   //活动开时间
	actEnd : {type: Date},                     //活动截止时间
	actStatus : {type: Number},                    //活动状态 1.仍然进行中  2.达到限定的人数
	actCreateTime : {type: Date,default: Date.now},               //活动创建时间
    actCurrentNum:{type:Number,default:1},   //当前活动的参与人数,默认为1，即发布者本人
    actRatio:{type:Number,default:0.05},
	acUid : {type: String},                      //活动发起人
    timeOfJoin:{type: Date,default: Date.now},   //预留接口
    actCurrComments:{type: Number, default: 0},                  //该活动的评论数
    actCity : {type : String}                      //城市
});

mongoose.model('activity', activitySchema);
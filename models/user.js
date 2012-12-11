/**
用户信息表
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  acUid : {type: String },                       //ac的用户id
  thirdPlatUid : {type: String},                 //第三方平台的UID
  thirdPlatType : {type: String},                //平台类型
  qq: {type: Number},                              //qq
  phone: {type: Number},                            //联系电话
  mail: {type: String},                            //邮箱
  gender : {type: Number},                           //性别 1：男、0：女 
  nickname : {type: String}                          //用户昵称
});

mongoose.model('user', userSchema);
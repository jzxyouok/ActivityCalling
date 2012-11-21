/**
软件更新表
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var versionSchema = new Schema({
	version : {type: String},                     //更新版本
	timeOfUpdate : {type: Date},                   //更新时间
        downloadUrl : {type: String}                                   //软件更新下载地址
});

mongoose.model('version', versionSchema);
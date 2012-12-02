var config = require('../config/config').config;
var url = require('url');
var models = require('../models');
var feedback = models.feedback;
var version = models.version;
var user = models.user;
var comment = models.comment;

//软件更新
exports.getUpdate = function(req, res) {
	var currVersion = req.query.currVersion ;
	version.findOne({
	},{
    },{
		sort:{timeOfUpdate: -1}
	},function(err,doc){
		if (err) {
			res.send(docToJson({"status":0}));
		}else{
			console.log(currVersion);
			console.log(doc.version);
			if (currVersion != doc.version){
				res.send(doc);
			}else{
				res.send(docToJson({"status":0}));
			}
		}
	});
}

//意见反馈
exports.feedback = function(req, res) {
	var acUid = req.body.acUid;
	var feedContent = req.body.feedContent;
	var feedbacks = new feedback();
	feedbacks.fbId = 'fb' + new Date().getTime() + RndNum(5);   //5位随机数
	feedbacks.content = feedContent;
	feedbacks.acUid = acUid;

	feedbacks.save(function (err, doc){
		if (err){
			res.send(docToJson({'status':0}));
		}else{
			res.send(docToJson({'status':1}));
		}
	});
}

//获取某个用户信息
exports.getInfo = function(req, res) {
	var acUid = req.params.acUid;
	user.findOne({
		acUid : acUid
	}, function (err, doc){
		if (err) {
			res.send(docToJson({'status': 0}));
		}else{
			console.log(doc);
			res.send(docToJson(doc));
		}
	});

}

//更新某个用户信息
exports.updateInfo = function(req, res) {
	var acUid = req.params.acUid;
	var content = req.body.content;
	var contacts = req.body.contact;
	if (contacts == 'phone') {             //改变联系方式的电话
		user.update({
			acUid: acUid
		},{
			phone: content
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (contacts == 'qq') {             //改变qq         
		user.update({
			acUid: acUid
		},{
			qq: content
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (contacts == 'mail'){
		user.update({                       //改变mail
			acUid: acUid
		},{
			mail: content
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else{
		res.send(docToJson({'status': 0}));
	}
}

//提交对某个活动的评论
exports.postComments = function(req, res) {
	var actId = req.body.actId;
	var acUid = req.body.acUid;
	var content = req.body.comments;
	var comments = new comment();
	comments.commentId = 'com' + new Date().getTime() ;
	comments.content = content;
	comments.acUid = acUid;
	comments.actId = actId;

	comments.save(function(err){
		if (err) {
			res.send(docToJson({'status':0}));
		}else{
			res.send(docToJson({'status':1}));
		}
	});

}

//获取某个活动的所有评论
exports.getComments = function(req, res) {
	var actId = req.params.actId;
	comment.find({
		actId: actId
	}, function(err, doc){
		console.log(doc);
		if (err) {
			res.send(docToJson({'status': 0}));
		}else{
			res.send(docToJson(doc));
		}
	})
}

//JSON
function docToJson(doc){
	return JSON.stringify(doc);
}

//固定 位数 随机数
function RndNum(n){
	var rnd="";
	for(var i=0;i<n;i++)
		rnd+=Math.floor(Math.random()*10);
	return rnd;
}


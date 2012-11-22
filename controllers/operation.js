var config = require('../config/config').config;
var url = require('url');
var models = require('../models');
var feedback = models.feedback;
var version = models.version;
var user = models.user;
var comment = models.comment;

//软件更新
exports.getUpdate = function(req, res) {
	var currVersion = req.query.currVersion || req.params.currVersion || req.body.currVersion;
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
	var acUid = req.body.acUid || req.query.acUid || req.params.acUid;
	var feedContent = req.body.feedContent || req.query.feedContent || req.params.feedContent;
	var feedbacks = new feedback();
	feedbacks.fbId = "FB" + new Date().getTime() + RndNum(5);   //5位随机数
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
	var acUid = req.body.acUid || req.query.acUid || req.params.acUid;
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
	var acUid = req.body.acUid || req.query.acUid || req.params.acUid;
	var qq = req.body.qq || req.query.qq || req.params.qq;
	var mail = req.body.mail || req.query.mail || req.params.mail;
	var phone = req.body.phone || req.query.phone || req.params.phone;

	if (qq != ''&& mail != '' && phone != '') {
		user.update({
			acUid: acUid
		},{
			phone: phone,
			mail:mail,
			qq:qq
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if ( qq != '' &&mail != '' ) {
		user.update({
			acUid: acUid
		},{
			qq: qq,
			mail:mail
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (qq != '' && phone != '') {
		user.update({
			acUid: acUid
		},{
			phone: phone,
			qq: qq
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (phone != '' && mail != '') {
		user.update({
			acUid: acUid
		},{
			phone: phone,
			mail: mail
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (phone != '') {
		user.update({
			acUid: acUid
		},{
			phone: phone
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (mail != '') {
		user.update({
			acUid: acUid
		},{
			mail: mail
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (qq != '') {
		user.update({
			acUid: acUid
		},{
			qq: qq
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else {
		res.send(docToJson({'status': 0}));
	}
}

//提交对某个活动的评论
exports.postComments = function(req, res) {
	var actId = req.body.actId || req.query.actId || req.params.actId;
	var acUid = req.body.acUid || req.query.acUid || req.params.acUid;
	var content = req.body.comments || req.query.comments || req.params.comments;
	var comments = new comment();
	comments.commentId = 'COM' + new Date().getTime() + RndNum(5);
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
	var actId = req.body.actId || req.query.actId || req.params.actId;
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


//用户第一次登陆的时候 平台认证  在后台注册 
exports.register = function(req, res){
	var thirdPlatUid =  req.body.thirdPlatUid || req.query.thirdPlatUid || req.params.thirdPlatUid;
	var thirdPlatType = req.body.thirdPlatType || req.query.thirdPlatType || req.params.thirdPlatType;
	var gender = req.body.gender || req.query.gender || req.params.gender;
	var qq = req.body.qq || req.query.qq || req.params.qq;
	var mail = req.body.mail || req.query.mail || req.params.mail;
	var phone = req.body.phone || req.query.phone || req.params.phone;

	if (qq == '' && mail  == '' && phone == '') {
		res.send(docToJson({'status' : 0}));
	} else{
		var users = new user();
		users.acUid = thirdPlatType + new Date().getTime() + RndNum(5) ;
		users.thirdPlatType = thirdPlatType;
		users.thirdPlatUid = thirdPlatUid;
		users.gender = gender;
		users.qq = qq;
		users.mail = mail;
		users.phone = phone;


		users.save(function (err, doc){
			if (err) {
				res.send(docToJson({'status' : 0}));
			}else{
				res.send(docToJson({'status' : 1}));
			}
		});
	}

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


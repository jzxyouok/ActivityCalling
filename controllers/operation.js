var config = require('../config/config').config;
var url = require('url');
var models = require('../models');
var feedback = models.feedback;
var version = models.version;
var user = models.user;
var comment = models.comment;
var Activity = models.activity; 

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
	var qq = req.body.qq;
	var mail = req.body.mail;
	var phone = req.body.phone;

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
	var actId = req.body.actId;
	var acUid = req.body.acUid;
	var content = req.body.comments;
	var comments = new comment();
	comments.commentId = 'COM' + new Date().getTime() + RndNum(5);
	comments.content = content;
	comments.acUid = acUid;
	comments.actId = actId;

	Activity.findOne({
		actId : actId
	}, function (err, activity){
		console.log(activity);
		if (activity == null ) {
			res.send(docToJson({'status':0}));
		}else{
			Activity.update({
				actId: actId
			}, {
				actCurrComments: activity.actCurrComments+1
			}, {
				multi : false
			}, function (err, num){
				if (err ) {
					res.send(docToJson({'status':0}));
				}else{
						comments.save(function(err){
							if (err) {
								res.send(docToJson({'status':0}));
							}else{
								res.send(docToJson({'status':1}));
							}
						});
				}
			})
		}
	})



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


//用户第一次登陆的时候 平台认证  在后台注册 
exports.register = function(req, res){
	var thirdPlatUid = req.body.thirdPlatUid;
	var thirdPlatType = req.body.thirdPlatType;
	var gender = req.body.gender;
	var qq = req.body.qq;
	var mail = req.body.mail;
	var phone = req.body.phone;
	var nickname = req.body.nickname;
	if (0) {
	//if (qq == '' && mail  == '' && phone == '') {
		res.send(docToJson({'status' : 0}));
	} else{

		user.findOne({
			thirdPlatUid: thirdPlatUid
		}, function (err, doc){
			if (doc == null) {

				var users = new user();
				users.acUid = thirdPlatType + new Date().getTime() + RndNum(5) ;
				users.thirdPlatType = thirdPlatType;
				users.thirdPlatUid = thirdPlatUid;
				users.gender = gender;
				users.qq = qq;
				users.mail = mail;
				users.phone = phone;
				users.nickname = nickname;


				users.save(function (err, doc){
					if (err) {
						res.send(docToJson({'status' : 0}));
					}else{
						res.send(docToJson({'acUid' : doc.acUid}));
					}
				});
			}else{
				res.send(docToJson({'acUid' : doc.acUid}));
			}
		})


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



//测试用

exports.showMongodb = function(req, res){

	var content = req.query.showMongodb;

	console.log(content);

	if ( content == '1' ) {
			user.find({
			}, function (err, doc){
				res.send(doc);
			});
		}else if (content == '2') {
			comment.find({
			}, function (err, doc){
				res.send(doc);
			});
		}else if (content == '3') {
			version.find({
			}, function (err, doc){
				res.send(doc);
			});
		}else{
			feedback.find({
			}, function (err, doc){
				res.send(doc);
			});
		}

};

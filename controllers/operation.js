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
	var nickname = req.body.nickname;

	if (qq != null&& mail != null && phone != null && nickname != null) { //1
		//res.send(docToJson({'qq': qq, 'mail' : mail , 'phone': phone, 'nickname': nickname}));
		user.update({
			acUid: acUid
		},{
			phone: phone,
			mail:mail,
			qq: qq,
			nickname: nickname
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send(err);
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if ( qq != null &&mail != null &&nickname != null) {//2
		user.update({
			acUid: acUid
		},{
			qq: qq,
			mail:mail,
			nickname: nickname
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("222222");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (qq != null && phone != null &&nickname != null) {//3
		user.update({
			acUid: acUid
		},{
			phone: phone,
			qq: qq,
			nickname: nickname
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("33333");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (phone != null && mail != null && nickname != null) {//4
		user.update({
			acUid: acUid
		},{
			phone: phone,
			mail: mail,
			nickname: nickname
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("44444444");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (phone != null && nickname!= null) { //5
		user.update({
			acUid: acUid
		},{
			phone: phone,
			nickname: nickname
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("5555555");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (mail != null && nickname != null) {//6
		user.update({
			acUid: acUid
		},{
			mail: mail
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("666666");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (qq != null && nickname!= null) {//7
		user.update({
			acUid: acUid
		},{
			qq: qq,
			nickname: nickname
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("7777777");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (qq != null) {//8
		user.update({
			acUid: acUid
		},{
			qq: qq
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("88888888");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (mail != null) {//9
		user.update({
			acUid: acUid
		},{
			mail: mail
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("9999999");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else if (phone != null) {//10
		user.update({
			acUid: acUid
		},{
			phone: phone
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("aaaaaaa");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else  if (nickname!= null) {//11
		user.update({
			acUid: acUid
		},{
			nickname: nickname
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("bbbbbbb");

			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else  if (qq!= null && mail != null) {//12
		user.update({
			acUid: acUid
		},{
			qq: qq,
			mail: mail
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				///res.send("cccccc");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else  if (qq!= null && phone != null) {//13
		user.update({
			acUid: acUid
		},{
			qq: qq,
			phone: phone
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("dddddddd");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else  if (phone!= null && mail != null) {//14
		user.update({
			acUid: acUid
		},{
			qq: qq,
			phone: phone
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("eeeeeeee");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else  if (qq!= null && mail != null && phone!=null) {//15
		user.update({
			acUid: acUid
		},{
			qq: qq,
			mail: mail,
			phone: phone
		},{
			multi: false
		},function(err, num){
			if (err) {
				res.send(docToJson({'status': 0}));
				//res.send("ffffffff");
			}else{
				res.send(docToJson({'status': 1}));
			}
		});
	}else{
		res.send(docToJson({'status': 0}));
		//res.send("ggggggg");
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
	}, function(err, comments){
		//console.log(comments);
		if (err) {
			res.send(docToJson({'status': 0}));
		}else if (comments.length != 0) {

			comlen = comments.length;

			function getherAllComacUid (commentlength , sendCom){
				
				var newdoc = new Array();
				var time = new Array();
				for (var i = commentlength-1; i >= 0; i--) {
					time.push(i);
				};
				for (var i = 0; i < commentlength; i++) {
					var acUid = comments[i].acUid;
					user.findOne({
						acUid : acUid
					}, function (err, doc){
						if (err) {
							res.send(docToJson({'status': 0}));
						}else if ( doc != null ){
							var i = time.pop();
							if (doc.nickname == null) {
								var nickname = "";
							}else{
								var nickname = doc.nickname;
							}
							var middoc = {
								actId : comments[i].actId,
								acUid : comments[i].acUid,
								content : comments[i].content,
								commentId : comments[i].commentId,
								timeOfCom : comments[i].timeOfCom,
								nickname : nickname
							};
							console.log(middoc);
							newdoc.push(middoc);
							if ( commentlength ==  newdoc.length) {
								res.send(docToJson(newdoc));
							};
						}else{
							res.send(docToJson({'status': 0}));
						}
					});
				};
			}

			getherAllComacUid(comlen, function (doc){
				res.send(docToJson(doc));
			});

		}else{
			res.send(docToJson({'status': 0}));
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
	console.log(gender);
	console.log(qq);
	console.log(mail);
	console.log(phone);
	console.log("1111");
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

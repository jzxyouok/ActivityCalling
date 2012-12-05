var config = require('../config/config').config;
var url = require('url');
var models = require('../models');
var crypto = require('crypto');
var admin = models.admin;
var feedback = models.feedback;
var version = models.version;
var user = models.user;
var comment = models.comment;
var activity = models.activity; 


exports.admin = function(req, res){
     res.render('admin',{
        layout:false
     });
}


exports.login = function(req, res){
	var username = req.body.username;
	var pass = req.body.pass;

	pass = md5(pass);

	console.log(username + " " + pass);

	admin.findOne({
		adminName : username
	}, function (err, doc){
		if (doc != null) {
			if (doc.adminPass == pass) {
				gen_session(username, pass, res);
				res.render('loginin', {
					layout:false
				});
			}else{
				res.send(docToJson({"status": 0}));
			}
		}else{
			res.send(docToJson({"status": 0}));
		}

	});


		/*admins = new admin();
	admins.adminName = "god";
	admins.adminPass = md5("654321");
	admins.adminPermisson = "god";
	admins.save(function(err){

	});

*/
}


exports.showuser = function (req, res) {
	console.log("ok1");
	user.find({
	}, function (err, doc){
		res.send(docToJson(doc));
	});
}

exports.showact = function (req, res) {
	console.log("ok2");
	activity.find({
	}, function (err, doc){
		res.send(docToJson(doc));
	});
}

exports.showcomment = function (req, res) {
	console.log("ok3");
	comment.find({
	}, function (err, doc){
		res.send(docToJson(doc));
	});
}

exports.showfeedback = function (req, res) {
	console.log("ok4");
	feedback.find({
	}, function (err, doc){
		res.send(docToJson(doc));
	});
}

exports.showver = function (req, res) {
	console.log("ok5");
	version.find({
	}, function (err, doc){
		res.send(docToJson(doc));
	});
}

exports.deleteact =function (req, res){
	var actId = req.body.actId;
	console.log(actId);
	activity.findOne({
		actId : actId
	}, function (err, doc){
		if (err) {
			res.send("0");
		}else{
			if (doc == null) {
				res.send("0");
			}else{
				doc.remove(function (err, doc1){
					if (err) {
						res.send("0");
					}else{
						res.send("1");
					}
				});
				console.log(doc);
			}
		}
	});
}

//md5 加密
function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};


function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
};


function gen_session(username, pass, res) {
  var auth_token = encrypt(username + '\t' + pass, config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {
    path:'/',
    maxAge:1000 * 60 * 60 * 24 * 7
  }); // cookie 有效期1周
}


//JSON
function docToJson(doc){
	return JSON.stringify(doc);
}
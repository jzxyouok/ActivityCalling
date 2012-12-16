var config = require('../config/config').config;
var url = require('url');
var models = require('../models');
var Activity = models.activity;
var UidActMatch = models.uidActMatch;
var User = models.user;

//发布活动
exports.publishActivity = function(req, res) {
  var actName = req.body.actName;
  var actContent = req.body.actContent;
  var actCategory = req.body.actCategory; //int类型，1:运动 2：K歌 3：桌游 4、聚餐
  var actAddress = req.body.actAddress;
  var actCity = req.body.actCity;   //增加字段：城市
  var actLongitude = req.body.actLongitude;
  var actLatitude = req.body.actLatitude;
  var actLimitNum = req.body.actLimitNum; //int
  var actStart = req.body.actStart; 
  var actEnd = req.body.actEnd;
  var acUid = req.body.acUid;    
  var timestamp=new Date().getTime(); //获得时间戳
  var actId = 'ACT'+timestamp+RndNum(5);
  var actStatus = 1;  //1:活动正在进行中,2:活动已经达到限定人数 
  var activities  = new  Activity();
        activities.actId = actId;
        activities.actName = actName;
        activities.actContent = actContent;
        activities.actCategory = actCategory;
        activities.actAddress = actAddress;
        activities.actCity = actCity;
        activities.actLongitude = actLongitude;
        activities.actLatitude = actLatitude;
        activities.actLimitNum = actLimitNum;
        activities.actStart = actStart;
        activities.actEnd = actEnd;
        activities.actStatus = actStatus;
        activities.acUid = acUid;
  
  activities.save(function(err) {
      if (err) {
       //return next(err);
       res.send(docToJson({"status":0})); 
      }
      else{
      res.send(docToJson({"status":1}));
      }
  
})
}

//客户端需要传递参数：城市名，获得所有未过期的并正在进行中的活动，并按照最新时间排列,返回所有大于当前时间的活动     
exports.getAllActivities = function(req, res){
      var actCity = req.params.actCity || req.body.actCity ||req.query.actCity ;  
     // var fuzzyCity = new RegExp(".*" +actCity +".*");   //根据城市名进行模糊搜索  类型为“XX城市XX”
     //复合搜索
     Activity.find({actCity:actCity}).where('actStatus',1).sort('actStart',-1).gt('actStart', new  Date()).execFind(function(err, activities) {
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
      }
      else{
          res.send(docToJson(activities));
          }
     })
}

//加入活动  并且不能重复加入

exports.joinActivity = function(req, res) {
  var acUid = req.body.acUid || req.query.acUid || req.params.acUid;   //用户Id
  var actId = req.body.actId || req.query.actId || req.params.actId;   //活动Id
  UidActMatch.findOne({acUid:acUid}).where('actId',actId).exec(function(err, matches){
     if(err){
       //return next(err);
       res.send(docToJson({"status":0})); 
       return;
     }
     else if(matches){
       res.send(docToJson({"status":1})); 
       return;
     }
     else{
     var uidActMatches = new UidActMatch();
      uidActMatches.acUid = acUid;
      uidActMatches.actId = actId;
      uidActMatches.save(function(err) {
      if (err) {
       //return next(err);
       res.send(docToJson({"status":0})); 
      }
      else{
      Activity.findOne({
      actId: actId
       }, function(err, doc) {
      if (doc) {
           var currNum = doc.actCurrentNum;
           var limitNum = doc.actLimitNum;
           var icrNum = currNum+1;
           doc.actCurrentNum = icrNum;
           doc.actRatio = icrNum/limitNum;
           if(currNum == doc.actLimitNum){
           doc.actLimitNum = 2;
           }
         }
         doc.save(function(err){  
            if(err) {
              //return next(err);
              uidActMatches.remove({actId: actId});
              res.send(docToJson({"status":0})); 
            }
           else{
                res.send(docToJson({"status":1}));
           }
    });
 
      })
     }
   })
 }})  
}

//筛选活动
exports.getSpecificActivity = function(req, res) {
    //（1）根据地点
    //（2）根据时间,前提也是考虑了地址
    //（3）根据热门程度
    //当然这些活动都是正在进行的
    var actStartTime = req.body.actStartTime || req.query.actStartTime;
    var actStopTime = req.body.actStopTime || req.query.actStopTime;
    var actAddress = req.body.actAddress || req.query.actAddress;
    var actSearchAddress = req.body.actSearchAddress || req.query.actSearchAddress;
    var hot = req.body.ishot || req.query.ishot;
    if(actSearchAddress!='') {
      actAddress = actSearchAddress;  //如果用户规定了搜索的地点，则覆盖默认的当前用户所在地点
    }
    var fuzzyCity = new RegExp(".*" +actAddress +".*"); 
    if(actStartTime!='' & actStopTime=='' & actAddress!='' & hot==''){
    console.log(1);
        Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).sort('actStart',-1).gte('actStart', actStartTime).execFind(function(err, activities) {
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
           }
           else{
          res.send(docToJson(activities));
          return;
          }
     })
    }
    else if(actStartTime!='' & actStopTime=='' & actAddress!='' & hot!=''){
     console.log(2);
        Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).sort('actStart',-1).gte('actStart', actStartTime).sort('actRatio',-1).execFind(function(err, activities) {
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
           }
         else{
          res.send(docToJson(activities));
          return;
          }
     })
    }
    else if(actStartTime!='' & actStopTime!='' & actAddress!='' & hot==''){
     console.log(3);
        Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).sort('actStart',-1).gte('actStart', actStartTime).lte('actEnd',actStopTime).execFind(function(err, activities) {
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
           }
         else{
          res.send(docToJson(activities));
          return;
          }
     })
    }
    else if(actStartTime!='' & actStopTime!='' & actAddress!='' & hot!=''){
     console.log(4);
        Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).sort('actStart',-1).gte('actStart', actStartTime).lte('actEnd',actStopTime).sort('actRatio',-1).execFind(function(err, activities) {
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
           }
         else{
          res.send(docToJson(activities));
          return;
          }
     })
    }
    else if(actStartTime=='' & actStopTime!='' & actAddress!='' & hot==''){
     console.log(5);
        Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).sort('actStart',-1).gte('actStart', new Date()).lte('actEnd',actStopTime).execFind(function(err, activities) {
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
           }
         else{
          res.send(docToJson(activities));
          return;
          }
     })
    }
    else if(actStartTime=='' & actStopTime!='' & actAddress!='' & hot!=''){
     console.log(6);
        Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).sort('actStart',-1).gte('actStart', new Date()).lte('actEnd',actStopTime).sort('actRatio',-1).execFind(function(err, activities) {
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
           }
         else{
          res.send(docToJson(activities));
          return;
          }
     })
    }
    else if(actStartTime=='' & actStopTime=='' & actAddress!='' & hot==''){
     console.log(7);
        Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).sort('actStart',-1).gte('actStart', new Date()).execFind(function(err, activities) {
        if (err) {
         // return next(err);
          res.send(docToJson({"status":0})); 
           }
         else{
          res.send(docToJson(activities));
          return;
          }
     })
    }
    else if(actStartTime=='' & actStopTime=='' & actAddress!='' & hot!=''){
     console.log(8);
        Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).sort('actStart',-1).gte('actStart', new Date()).sort('actRatio',-1).execFind(function(err, activities) {
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
           }
         else{
          res.send(docToJson(activities));
          return;
          }
     })
    }
    
}

//随机搜索(摇一摇)
exports.getRandomActivity = function(req, res) {
//可以接收地址信息，根据地址来进行搜索
    var actAddress = req.params.actAddress || req.body.actAddress ||req.query.actAddress;
    var fuzzyCity = new RegExp(".*" +actAddress +".*"); 
    Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).gt('actStart', new  Date()).execFind(function(err, activities) {
      if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
      }
      else{
          var actLen = activities.length;
          var ran = Math.floor(Math.random()*(actLen+1));
          res.send(docToJson(activities[ran]));
          }
     })
}

//获取某个用户参加的活动
exports.getActivityOfJoin = function(req, res) {
   var acUid = req.params.acUid || req.body.acUid || req.query.acUid; 
   //根据用户ID进行搜索
   UidActMatch.find({acUid:acUid}).sort('timeOfJoin',-1).execFind(function(err, activities) {
    console.log(activities);
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
      }
      else if(activities.length != 0){
         var actLen = activities.length;
         console.log(actLen);
          function getherAllActsInfo(activityLen,sendActs){
             var i=0;
             var acts = new Array();
             var jointime = new Array();
             for(i=0;i<activityLen;i++){
                var actId = activities[i].actId;
                var timeofjoin = activities[i].timeOfJoin;
                jointime.push(timeofjoin);
                var j=0;
                Activity.findOne({actId:actId},function(err,activity){
                  console.log(activity);
              if(err){
               // console.log("activity");
                  // return next(err);
                   res.send(docToJson({"status":0}));
                    }
              else if(activity != null){
                //console.log("activity");
                   var tj = jointime.pop(j++);
                   activity.timeOfJoin = tj;
                   acts.push(activity);
                   if(actLen == acts.length){
                     sendActs(acts);
                     acts.length = 0;
                     j=0;
                     jointime.length = 0;
                   }
               }else{
                    //console.log("activity");
                    res.send(docToJson({"status":0}));
                   }
             })
           }
         }
           getherAllActsInfo(actLen,function(acts){
            res.send(docToJson(acts));
          })
     }else{
      res.send(docToJson({"status":0}));
     }
    })
}

//获取某个用户发布的活动
exports.getActivityOfPublish = function(req, res) {
   var acUid = req.params.acUid || req.body.acUid || req.query.acUid; 
   //根据用户ID进行搜索
   Activity.find({acUid:acUid}).sort('actStart',-1).execFind(function(err, activities) {
        if (err) {
         //return next(err);
          res.send(docToJson({"status":0})); 
      }
      else{
          res.send(docToJson(activities));
          }
     })
}

//获取相关类别的活动
exports.getActivityOfCate = function(req, res) {
     var actAddress = req.params.actAddress || req.body.actAddress || req.query.actAddress;   
     var actCategory = req.params.actCategory || req.body.actCategory || req.query.actCategory;  //根据类别
     var fuzzyCity = new RegExp(".*" +actAddress +".*");
     Activity.find({actAddress:{'$all':[fuzzyCity]}}).where('actStatus',1).where('actCategory',actCategory).sort('actStart',-1).gt('actStart', new  Date()).execFind(function(err, activities) {
        if (err) {
          //return next(err);
          res.send(docToJson({"status":0})); 
      }
      else{
          res.send(docToJson(activities));
          }
     })    
}

//根据活动ID返回该活动的具体信息
exports.getActivityByActId = function(req, res) { 
     var actId = req.params.actId || req.body.actId || req.query.actId;  //根据活动ID
     Activity.findOne({actId:actId}, function (err, activitity) {
        if (err) {
         // return next(err);
          res.send(docToJson({"status":0})); 
      }
      else{
            User.findOne({
              acUid: activitity.acUid
            }, function (err, user){
              if (err) {
                res.send(docToJson({"status":0})); 
              }else if ( user == null) {
                res.send(docToJson({"status":0})); 
              }else{

                var newactivitity = {
                    actId : activitity.actId,
                    actName : activitity.actName,
                    actContent : activitity.actContent,
                    actCategory : activitity.actCategory,
                    actAddress : activitity.actAddress,
                    actCity : activitity.actCity,
                    actLongitude : activitity.actLongitude,
                    actLatitude : activitity.actLatitude,
                    actLimitNum : activitity.actLimitNum,
                    actStart : activitity.actStart,
                    actEnd : activitity.actEnd,
                    actStatus : activitity.actStatus,
                    acUid : activitity.acUid,
                    nickname : user.nickname
                  };

                //console.log(newactivitity);
                res.send(docToJson(newactivitity));
              }
            });
            //res.send(docToJson(activitity));
          }
     })    
}

//根据活动ID返回已经选择了这个活动的用户信息
exports.getMembersOfThisAct = function(req, res) { 
   var acUid = req.params.acUid || req.body.acUid || req.query.acUid; 
   //根据用户ID进行搜索
   UidActMatch.find({acUid:acUid}).execFind(function(err, activities) {
        if (err) {
        //  return next(err);
          res.send(docToJson({"status":0})); 
      }
      else if(activities){
         var actLen = activities.length;
          function getherAllUsersInfo(activityLen,sendUsers){
             var i=0;
             var users = new Array();
             for(i=0;i<activityLen;i++){
                var acUid = activities[i].acUid;
                User.findOne({acUid:acUid},function(err,user){
              if(err){
               //    return next(err);
                   res.send(docToJson({"status":0}));
                    }
              else if(user){
                    users.push(user);
                   if(actLen == users.length){
                     sendUsers(users);
                     users.length = 0;
                   }
               }
             })
           }
         }
           getherAllUsersInfo(actLen,function(users){
            res.send(docToJson(users));
          })
     }
    })
   }

//测试用的
exports.test = function(req, res){
     res.render('test',{
        layout:false
     })
}


function docToJson(doc){
   return JSON.stringify(doc);
}

function RndNum(n){
   var rnd="";
   for(var i=0;i<n;i++)
     rnd+=Math.floor(Math.random()*10);
   return rnd;
}




/**
 * 路由匹配
 */

var activity = require('../controllers/activity');
var operation = require('../controllers/operation');
var admin = require('../controllers/admin');

module.exports = function (app) {
  //移动客户端调用服务接口
  app.get('/test',activity.test);  //测试


  app.post('/publishActivity',activity.publishActivity);
  app.post('/joinActivity',activity.joinActivity);
  app.get('/getSpecificActivity',activity.getSpecificActivity);
  app.get('/getAllActivities',activity.getAllActivities);
  app.get('/getUpdate',operation.getUpdate);
  app.post('/feedback',operation.feedback);
  app.get('/getRandomActivity',activity.getRandomActivity);
  app.get('/:acUid/getInfo',operation.getInfo);
  app.post('/:acUid/updateInfo',operation.updateInfo);
  app.get('/:acUid/getMyActivity',activity.getMyActivity);
  app.post('/updateAcStatus',activity.updateAcStatus);
  app.post('/postComments',operation.postComments);
  app.get('/:actId/getComments',operation.getComments);
  app.get('/:acUid/getActivityOfJoin',activity.getActivityOfJoin);
  app.get('/getActivityOfJoin',activity.getActivityOfJoin);
  app.get('/:acUid/getActivityOfPublish',activity.getActivityOfPublish);
  app.get('/getActivityOfPublish',activity.getActivityOfPublish);
  app.get('/:actCategory/getActivityOfCate',activity.getActivityOfCate);
  app.get('/getActivityOfCate',activity.getActivityOfCate);
  app.get('/:actId/getActivityByActId',activity.getActivityByActId);
  app.get('/getActivityByActId',activity.getActivityByActId);
  app.get('/:actId/getMembersOfThisAct',activity.getMembersOfThisAct);
  app.get('/getMembersOfThisAct',activity.getMembersOfThisAct);
  app.post('/register', operation.register);

  //admin
  app.get('/admin', admin.admin);
  app.post('/login', admin.login);


//查看

  app.get('/showuser',admin.showuser);
  app.get('/showact',admin.showact);
  app.get('/showcomment',admin.showcomment);
  app.get('/showfeedback',admin.showfeedback);
  app.get('/showver',admin.showver);
  app.get('/showmat', admin.showmat);
  app.post('/deleteact' ,admin.deleteact);
  app.post('/deletemat', admin.deletemat);
 
}

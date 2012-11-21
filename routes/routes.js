/**
 * 路由匹配
 */

var activity = require('../controllers/activity');
var operation = require('../controllers/operation');

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
  app.get('/:uid/getInfo',operation.getInfo);
  app.post('/:uid/updateInfo',operation.updateInfo);
  app.get('/:uid/getMyActivity',activity.getMyActivity);
  app.post('/updateAcStatus',activity.updateAcStatus);
  app.post('/postComments',operation.postComments);
  app.get('/:actId/getComments',operation.getComments);
  app.post('/:acUid/updateInfo',operation.updateInfo);
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
 
}

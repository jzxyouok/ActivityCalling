/**
 * 配置文件
 */

var path = require('path');

exports.config = {
  name: 'AC',
  description: '活动召集',
  version: '0.0.1',
  host: 'localhost',
  site_static_host: '', // 静态文件存储域名
  db: 'mongodb://127.0.0.1/actcon',
  session_secret: 'activityconvene',
  auth_cookie_name: 'activityconvene',
  port: 8888,
};

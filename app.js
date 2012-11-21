//信雅达认证管理系统 - app.js入口 


 var path = require('path');
 var express = require('express');
 var config = require('./config/config').config;
 var urlinfo = require('url').parse(config.host);
 config.hostname = urlinfo.hostname || config.host;
 var routes = require('./routes/routes');


 var app = express.createServer();

 // 环境配置
 app.configure(function() {
   var viewsRoot = path.join(__dirname, 'views');
   app.set('view engine', 'html');
   app.set('views', viewsRoot);
   app.register('.html', require('ejs'));
   app.use(express.bodyParser({
   }));
   app.use(express.cookieParser());
   app.use(express.session({
     secret: config.session_secret
   }));


   var maxAge = 3600000 * 24 * 30;
 

   var staticDir = path.join(__dirname, 'public');
   app.configure('development', function() {
     app.use(express.static(staticDir));
     app.use(express.errorHandler({
       dumpExceptions: true,
       showStack: true
     }));
   });

   app.configure('production', function() {
     app.use(express.static(staticDir, {
       maxAge: maxAge
     }));
     app.use(express.errorHandler());
     app.set('view cache', true);
   });

   // 路由routers
   routes(app);
   
   if(!module.parent) {
   app.listen(config.port);
   console.log('服务器监听端口号 %d in %s 模式',app.address().port,app.settings.env);
   }


   module.exports = app;
 })
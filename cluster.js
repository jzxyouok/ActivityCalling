/** cluster.js的功能是创建与cpu核心个数相同的服务器进程以确保充分利用多核CPU资源
  * 主进程生成若干个工作进程，并监听工作进程结束事件，当工作进程结束时，重新启动一个工作进程
  */


var cluster = require('cluster');
   var os =  require('os');
   var config = require('./config/config').config;

//获取CPU的数量
   var numCPUs = os.cpus().length; 
   var workers = {};
   
    if (cluster.isMaster) {
        // 主进程分支
         cluster.on('death', function(worker) {
            //当一个进程结束时，重启工作进程
            delete workers[worker.pid];
                   worker = cluster.fork();
                   workers[worker.pid] = worker;
                   });
             //初始开启与CPU数量相同的工作进程
           for(var i = 0; i < numCPUs; i++){
              var worker = cluster.fork();
                  workers[worker.pid] = worker;
                  console.log(worker.pid+"启动工作进程监听请求");
           }
          } else {
             //工作进程分支，启动服务器
             var app = require('./app');
             app.listen(config.port);
           }
           
           //当主进程被终止时，关闭所有工作进程
           process.on('SIGTERM',function() {
           for (var pid in workers) {
               process.kill(pid);
           }
           process.exit(0);
           })
          

        
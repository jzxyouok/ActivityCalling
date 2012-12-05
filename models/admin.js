var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({               
  adminName : {type: String},
  adminPass : {type: String},
  adminPermission : {type: String}          //管理员权限  
});

mongoose.model('admin', adminSchema);
var mongoose = require('mongoose'),
    appconfig=require('../config/config').config;

mongoose.connect(appconfig.db, function (err) {
  if (err) {
    console.error('connect to %s error: ',appconfig.db, err.message);
    process.exit(1);
  }
});


require('./user');
require('./activity');
require('./comment');
require('./feedback');
require('./version');
require('./uidActMatch');
require('./admin'),


exports.user = mongoose.model('user');
exports.activity = mongoose.model('activity');
exports.comment = mongoose.model('comment');
exports.feedback = mongoose.model('feedback');
exports.version = mongoose.model('version');
exports.uidActMatch = mongoose.model('uidActMatch');
exports.admin = mongoose.model('admin');

var mongoose = require('mongoose');
var config = require('./env/development.js');

module.exports = function() {
    var db = mongoose.connect(config.db_url);

    require('./../application/models/users.server.model.js');
    require('./../application/models/images.server.model.js');
    require('./../application/models/comments.server.model.js');

    return db;
};

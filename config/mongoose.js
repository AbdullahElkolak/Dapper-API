var mongoose = require('mongoose'),
    config = require('./config');

module.exports = function() {
    var db = mongoose.connect(config.db_url);

    require('../app/models/users.server.model');
    require('../app/models/posts.server.model');
    require('../app/models/comments.server.model');

    return db;
};

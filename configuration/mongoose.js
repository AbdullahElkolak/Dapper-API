var mongoose = require('mongoose');
    //config = require('./config');

module.exports = function() {
    var db = mongoose.connect('mongodb://localhost/imageuploadertest');

    require('./../application/models/users.server.model.js');
    require('./../application/models/images.server.model.js');
    require('./../application/models/comments.server.model.js');

    return db;
};

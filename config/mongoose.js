/**
* Mongodb configuration.
* Created by Kudzai Gopfa on 3/5/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const mongoose    =  require('mongoose');
const config      =  require('./env/development.js');

module.exports = function() {
    let db = mongoose.connect(config.DB_URL, { useMongoClient: true });

    require('./../app/models/users.server.model.js');
    require('./../app/models/images.server.model.js');
    require('./../app/models/comments.server.model.js');
    require('./../app/models/follow.server.model.js');

    return db;
};

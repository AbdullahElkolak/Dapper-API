/**
* Image router.
* Created by Kudzai Gopfa on 3/5/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const images     =  require('./../controllers/images.server.controller.js');
const users      =  require('./../controllers/users.server.controller.js');
const passport   =  require('passport');

module.exports = function(app) {
    app.route('/api/images')
        .get(passport.authenticate('jwt', {session: false}), images.list)
        .post(passport.authenticate('jwt', {session: false}), images.upload);

    app.route('/api/images/:imageId')
        .get(passport.authenticate('jwt', {session: false}), images.read)
        .put(passport.authenticate('jwt', {session: false}), images.update)
        .delete(passport.authenticate('jwt', {session: false}), images.delete);

    app.param('imageId', images.imageByID);
};

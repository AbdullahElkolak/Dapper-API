/**
* Comment router.
* Created by Kudzai Gopfa on 3/7/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const users      =  require('./../controllers/users.server.controller');
const comments   =  require('./../controllers/comments.server.controller');
const images     =  require('./../controllers/images.server.controller.js');
const passport   =  require('passport');

module.exports = function(app) {
    app.route('/api/images/:imageId/comments')
        .get(passport.authenticate('jwt', {session: false}), comments.list)
        .post(passport.authenticate('jwt', {session: false}), comments.create);

    app.route('/api/images/:imageId/comments/:commentId')
        .put(passport.authenticate('jwt', {session: false}), comments.update)
        .delete(passport.authenticate('jwt', {session: false}), comments.delete);

    app.param('commentId', comments.commentByID);
    app.param('imageId', images.imageByID);
};

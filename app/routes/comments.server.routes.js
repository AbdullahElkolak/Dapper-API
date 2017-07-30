/**
* Comment router.
* Created by Kudzai Gopfa on 3/7/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const comments   =  require('./../controllers/comments.server.controller');
const images     =  require('./../controllers/images.server.controller.js');
const passport   =  require('passport');

module.exports = function(app) {
    app.route('/api/images/:imageId/comments/:commentID')
        .get(comments.read)
        .delete(passport.authenticate('jwt', {session: false}), comments.delete)
        .post(passport.authenticate('jwt', {session: false}), comments.create);

    app.param('imageId', images.imageByID);
    app.param('commentID', comments.commentByID);
};

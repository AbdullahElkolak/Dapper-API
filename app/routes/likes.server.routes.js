/**
* Likes router.
* Created by Kudzai Gopfa on 29/7/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const likes      =  require('./../controllers/likes.server.controller.js');
const images     =  require('./../controllers/images.server.controller.js');
const passport   =  require('passport');

module.exports = function(app) {
    app.route('/api/images/:imageId/like')
        .post(passport.authenticate('jwt', {session: false}), likes.like)
        .delete(passport.authenticate('jwt', {session: false}), likes.unlike);

    app.param('imageId', images.imageByID);
};

/**
* Follow router.
* Created by Kudzai Gopfa on 29/7/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const follows    =  require('./../controllers/follow.server.controller.js');
const users      =  require('./../controllers/users.server.controller.js');
const passport   =  require('passport');

module.exports = function(app) {
    app.route('/api/users/:profileId/follow')
        .post(passport.authenticate('jwt', {session: false}), follows.follow)
        .delete(passport.authenticate('jwt', {session: false}), follows.unfollow);

    app.get('/api/users/:profileId/followers', passport.authenticate('jwt', {session: false}), follows.listFollowers);

    app.get('/api/users/:profileId/followering', passport.authenticate('jwt', {session: false}), follows.listFollowing);

    app.param('profileId', users.userByID);
};

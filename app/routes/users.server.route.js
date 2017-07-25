/**
* Users router.
* Created by Kudzai Gopfa on 3/5/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const users          =   require('../controllers/users.server.controller');
const passport       =   require('passport');

module.exports = function(app) {
    app.post('/api/signup/authentication/email', users.email);

    app.post('/api/signup/authentication/username', users.username);

    app.route('/api/users')
        .get(passport.authenticate('jwt', {session: false}), users.list)
        .post(users.create);

    app.post('/api/users/login', users.login);

    app.route('/api/users/:profileId')
        .get(passport.authenticate('jwt', {session: false}), users.read)
        .post(passport.authenticate('jwt', {session: false}), users.upload)
        .put(passport.authenticate('jwt', {session: false}), users.update);

    app.get('/signout', users.logout);

    app.param('profileId', users.userByID);
};

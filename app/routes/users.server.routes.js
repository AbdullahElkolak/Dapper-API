var users = require('../controller/users.server.controller'),
    passport = require('passport');

module.exports = function(app) {
    app.route('/signup').get(users.renderSignup).post(users.CreateAccount);

    app.route('/signin').post( passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })).get(users.renderSignin);

    app.get('/signout', users.LogoutUser);
};
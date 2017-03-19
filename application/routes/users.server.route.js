var users = require('../controllers/users.server.controller'),
    passport = require('passport');

module.exports = function(app) {
    app.route('/api/signup').get(users.renderSignup).post(users.createAccount);

    app.post('/api/signup/authentication/email', users.CheckIfEmailInUse);

    app.post('/api/signup/authentication/username', users.CheckIfUsernameAvailable);

    app.route('/signin').post( passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/signin'
    })).get(users.renderSignin);

    app.get('/signout', users.LogoutUser);
};

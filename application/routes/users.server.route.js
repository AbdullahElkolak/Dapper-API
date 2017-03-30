var users = require('../controllers/users.server.controller'),
    passport = require('passport');

module.exports = function(app) {
    app.route('/api/signup').get(users.renderSignup).post(users.createAccount);

    app.post('/api/signup/authentication/email', users.CheckIfEmailInUse);

    app.post('/api/signup/authentication/username', users.CheckIfUsernameAvailable);
	
	app.post('/api/user/avatar', users.avatarUpload);

    app.route('/api/signin').post( passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/api/signin'
    })).get(users.renderSignin);

    app.get('/signout', users.LogoutUser);
};

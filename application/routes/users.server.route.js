/**
 * User tasks routing file
 * Created by Kudzai Gopfa on 3/5/2017.
 */

var users = require('../controllers/users.server.controller'),
    passport = require('passport');

module.exports = function(app) {
    app.route('/api/signup').get(users.renderSignup).post(users.createAccount);

    app.post('/api/signup/authentication/email', users.CheckIfEmailInUse);

    app.post('/api/signup/authentication/username', users.CheckIfUsernameAvailable);

	  app.route('/api/user/avatar').post(users.avatarUpload)
      .get(users.renderAvatarUpload);

    app.route('/api/signin').post(users.UserLogin).get(users.renderSignin);

    app.get('/signout', users.LogoutUser);
};

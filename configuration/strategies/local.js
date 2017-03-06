/**
 * Created by kudza on 3/5/2017.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('Users');

module.exports = function() {
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Incorrect password, Please Try Again!'
                });
            }
            return done(null, user);
        });
    }));
};
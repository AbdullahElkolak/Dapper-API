var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function() {
    var Users = mongoose.model('Users');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Users.findOne({
            _id: id
        }, '-password -salt', function(err, user) {
            done(err, user);
        });
    });

    require('./strategies/local.js')();
};

/**
 * JWT authentication strategy file
 * Created by Kudzai Gopfa on 3/5/2017.
 */

var passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    config = require('../env/development.js'),
    User = require('mongoose').model('Users');

module.exports = function() {
    passport.use(new JwtStrategy(config.jwtOptions, function(jwt_payload, done) {
        User.findOne({
            id: jwt_payload.sub
        }, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            }
            else {
              done(null, false);
            }
        });
    }));
};

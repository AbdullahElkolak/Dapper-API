/**
 * JWT authentication strategy file
 * Created by Kudzai Gopfa on 3/5/2017.
 */

var passport = require('passport'),
    User = require('mongoose').model('Users');

var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

module.exports = function() {

    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
    jwtOptions.secretOrKey = 'tasmanianDevil';

    var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
        console.log('payload received', jwt_payload._id);

        User.findOne({
            id: jwt_payload.id
        }, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });
    });

    passport.use(strategy);
};

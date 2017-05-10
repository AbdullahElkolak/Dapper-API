/**
 * Express configuration file
 * Created by Kudzai Gopfa on 3/5/2017.
 */


var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('flash');
var methodOverride = require('method-override');
var config = require('./env/development.js');
var passport = require('passport');
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

module.exports = function() {
    var app = express();
    var User = require('mongoose').model('Users');

    app.use(logger('dev'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    
    app.use(bodyParser.json());
    app.use(methodOverride());

	  app.set('view engine', 'ejs');

    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: config.sessionSecret
    }));

    app.use(flash());

    app.use('/uploads', express.static('uploads'));

    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
    jwtOptions.secretOrKey = 'tasmanianDevil';

    var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
        console.log('payload received', jwt_payload._id);

        User.findOne({
            _id: jwt_payload._doc._id
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

    app.use(passport.initialize());

    require('./../application/routes/index.server.route.js')(app);
    require('./../application/routes/users.server.route.js')(app);
    require('./../application/routes/images.server.route.js')(app);
    require('./../application/routes/comments.server.routes.js')(app);

    return app;
};

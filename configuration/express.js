/**
 * Express configuration file
 * Created by Kudzai Gopfa on 3/5/2017.
 */

var passport = require('passport');
var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('flash');
var methodOverride = require('method-override');
var config = require('./env/development.js');

module.exports = function() {
    var app = express();

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

    require('./strategies/local-jwt')();

    app.use(passport.initialize());

    require('./../application/routes/index.server.route.js')(app);
    require('./../application/routes/users.server.route.js')(app);
    require('./../application/routes/images.server.route.js')(app);
    require('./../application/routes/comments.server.routes.js')(app);

    return app;
};

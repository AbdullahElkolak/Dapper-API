var passport = require('passport');
var express = require('express');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('flash');
var methodOverride = require('method-override');

module.exports = function() {
    var app = express();

    app.use(logger('dev'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: 'supersecret'
    }));
    app.use(flash());

    app.set('views', './application/views');
    app.set('view engine', 'ejs');

    app.use(passport.initialize());
    app.use(passport.session());

    require('./../application/routes/users.server.route.js')(app);
    require('./../application/routes/images.server.route.js')(app);
    require('./../application/routes/index.server.routes.js')(app);
    require('./../application/routes/comments.server.routes.js')(app);

    return app;
};


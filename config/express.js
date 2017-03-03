var config = require('./config'),
    express = require('express'),
    logger = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session');

module.exports = function() {
    var app = express();

    if(process.env.NODE_ENV === 'development') {
        app.use(logger('dev'));
    } else if(process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(multer({dest: './app/controller/store'}).single('photo'));

    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: config.session_secret
    }));
    app.use(flash());

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(passport.initialize());
    app.use(passport.session());

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/posts.server.routes.js')(app);
    require('../app/routes/comments.server.routes.js')(app);

    app.use(express.static('./public'));

    return app;
};

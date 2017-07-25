/**
* Express configuration.
* Created by Kudzai Gopfa on 3/5/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const express         =  require('express');
const logger          =  require('morgan');
const bodyParser      =  require('body-parser');
const methodOverride  =  require('method-override');
const config          =  require('./env/development.js');
const passport        =  require('passport');

module.exports = function() {
    let app = express();

    app.use(logger('dev'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(methodOverride());

    require('./strategies/local-jwt.js')();

    app.use('/uploads', express.static('uploads'));

    app.use(passport.initialize());

    require('./../application/routes/users.server.route.js')(app);
    require('./../application/routes/images.server.route.js')(app);
    require('./../application/routes/comments.server.routes.js')(app);

    app.post('/api/test', passport.authenticate('jwt', {session: false}), function(req, res) {res.send({message: req.body})});

    return app;
};

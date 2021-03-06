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
const cors            =  require('cors');

module.exports = function() {
    let app = express();

    app.use(logger('dev'));

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cors());

    require('./strategies/local-jwt.js')();

    app.use('/uploads', express.static('uploads'));

    app.use(passport.initialize());
    
    app.get('/', (req, res) => {
        res.send({message: 'Server up and running'});
    });

    require('./../app/routes/users.server.route.js')(app);
    require('./../app/routes/images.server.route.js')(app);
    require('./../app/routes/likes.server.routes.js')(app);
    require('./../app/routes/comments.server.routes.js')(app);
    require('./../app/routes/follow.server.routes.js')(app);

    return app;
};
